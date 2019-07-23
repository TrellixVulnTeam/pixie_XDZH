#include <google/protobuf/text_format.h>
#include <gtest/gtest.h>
#include <vector>

#include "src/carnot/plan/plan_fragment.h"
#include "src/carnot/planpb/plan.pb.h"

namespace pl {
namespace carnot {
namespace plan {

using google::protobuf::TextFormat;

const char* kPlanFragmentWithAllNodes = R"(
  id: 1,
  dag {
    nodes {
      id: 1
      sorted_deps: 2
      sorted_deps: 3
    }
    nodes {
      id: 2
      sorted_deps: 4
    }
    nodes {
      id: 3
      sorted_deps: 4
    }
    nodes {
      id: 4
      sorted_deps: 5
    }
    nodes {
      id: 5
      sorted_deps: 6
    }
    nodes {
      id: 6
      sorted_deps: 7
    }
    nodes {
      id: 7
    }
  }
  nodes {
    id: 1
    op {
      op_type: MEMORY_SOURCE_OPERATOR
      mem_source_op {
        name: "mem_source"
      }
    }
  }
  nodes {
    id: 2
    op {
      op_type: MAP_OPERATOR
      map_op {
        expressions {
          constant {
            data_type: INT64
            int64_value: 1
          }
        }
        column_names: "test"
      }
    }
  }
  nodes {
    id: 3
    op {
      op_type: MAP_OPERATOR
      map_op {
        expressions {
          constant {
            data_type: INT64
            int64_value: 1
          }
        }
        column_names: "test2"
      }
    }
  }
  nodes {
    id: 4
    op {
      op_type: AGGREGATE_OPERATOR
      agg_op {
        windowed: false
        values {
          name: "blocking_agg"
        }
        value_names: "test3"
      }
    }
  }
  nodes {
    id: 5
    op {
      op_type: FILTER_OPERATOR
      filter_op {
        expression {
          constant {
            data_type: BOOLEAN
            bool_value: true
          }
        }
        columns {
          node: 4
          index: 0
        }
      }
    }
  }
  nodes {
    id: 6
    op {
      op_type: LIMIT_OPERATOR
      limit_op {
        limit: 10
        columns {
          node: 4
          index: 0
        }
      }
    }
  }
  nodes {
    id: 7
    op {
      op_type: MEMORY_SINK_OPERATOR
      mem_sink_op {
        name: "mem_sink"
      }
    }
  }
)";

class PlanFragmentWalkerTest : public ::testing::Test {
 protected:
  void SetUp() override {
    planpb::PlanFragment pf_pb;
    ASSERT_TRUE(TextFormat::MergeFromString(kPlanFragmentWithAllNodes, &pf_pb));
    ASSERT_OK(plan_fragment_.Init(pf_pb));
  }
  PlanFragment plan_fragment_ = PlanFragment(1);
};

TEST_F(PlanFragmentWalkerTest, basic_tests) {
  std::vector<int64_t> col_order;
  int mem_src_call_count = 0;
  int map_call_count = 0;
  int agg_call_count = 0;
  int mem_sink_call_count = 0;
  int filter_call_count = 0;
  int limit_call_count = 0;

  PlanFragmentWalker()
      .OnMemorySource([&](auto& mem_src) {
        col_order.push_back(mem_src.id());
        mem_src_call_count++;
      })
      .OnMap([&](auto& map) {
        col_order.push_back(map.id());
        map_call_count++;
      })
      .OnAggregate([&](auto& agg) {
        col_order.push_back(agg.id());
        agg_call_count++;
      })
      .OnMemorySink([&](auto& mem_sink) {
        col_order.push_back(mem_sink.id());
        mem_sink_call_count++;
      })
      .OnFilter([&](auto& filter) {
        col_order.push_back(filter.id());
        filter_call_count++;
      })
      .OnLimit([&](auto& limit) {
        col_order.push_back(limit.id());
        limit_call_count++;
      })
      .Walk(&plan_fragment_);
  EXPECT_EQ(1, mem_src_call_count);
  EXPECT_EQ(1, mem_sink_call_count);
  EXPECT_EQ(1, agg_call_count);
  EXPECT_EQ(2, map_call_count);
  EXPECT_EQ(1, filter_call_count);
  EXPECT_EQ(1, limit_call_count);
  EXPECT_EQ(std::vector<int64_t>({1, 2, 3, 4, 5, 6, 7}), col_order);
}

}  // namespace plan
}  // namespace carnot
}  // namespace pl
