import { StatusGroup } from 'components/status/status';
import {
  createStyles, makeStyles, Theme, withStyles,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import * as React from 'react';
import { Link } from 'react-router-dom';

const tooltipStyles = makeStyles(() => createStyles({
  tooltip: {
    margin: 0,
  },
}));

const SEC_MS = 1000;
const MIN_MS = 60 * SEC_MS;
const HOURS_MS = 60 * MIN_MS;

export function convertHeartbeatMS(lastHeartbeatMs: number): string {
  const result = [];
  let time = lastHeartbeatMs;
  const hours = Math.floor(time / (HOURS_MS));
  if (hours > 0) {
    result.push(`${hours} hours`);
    time %= HOURS_MS;
  }
  const minutes = Math.floor(time / MIN_MS);
  if (minutes > 0) {
    result.push(`${minutes} min`);
    time %= MIN_MS;
  }
  const seconds = Math.floor(time / SEC_MS);
  result.push(`${seconds} sec`);
  return `${result.join(' ')} ago`;
}

export function agentStatusGroup(status: string): StatusGroup {
  if (['AGENT_STATE_HEALTHY'].indexOf(status) !== -1) {
    return 'healthy';
  } if (['AGENT_STATE_UNRESPONSIVE'].indexOf(status) !== -1) {
    return 'unhealthy';
  }
  return 'unknown';
}

export function clusterStatusGroup(status: string): StatusGroup {
  if (['CS_HEALTHY', 'CS_UPDATING', 'CS_CONNECTED'].indexOf(status) !== -1) {
    return 'healthy';
  } if (['CS_UNHEALTHY', 'CS_UPDATE_FAILED'].indexOf(status) !== -1) {
    return 'unhealthy';
  }
  return 'unknown';
}

export function getClusterDetailsURL(clusterName: string): string {
  return `/admin/clusters/${clusterName}`;
}

export function podStatusGroup(status: string): StatusGroup {
  switch (status) {
    case 'RUNNING':
    case 'SUCCEEDED':
      return 'healthy';
    case 'FAILED':
      return 'unhealthy';
    case 'PENDING':
      return 'pending';
    case 'UNKNOWN':
    default:
      return 'unknown';
  }
}

export function containerStatusGroup(status: string): StatusGroup {
  switch (status) {
    case 'CONTAINER_STATE_RUNNING':
      return 'healthy';
    case 'CONTAINER_STATE_TERMINATED':
      return 'unhealthy';
    case 'CONTAINER_STATE_WAITING':
      return 'pending';
    case 'CONTAINER_STATE_UNKNOWN':
    default:
      return 'unknown';
  }
}

export const AdminTooltip = ({ children, title }) => {
  const classes = tooltipStyles();
  return (
    <Tooltip title={title} placement='bottom' interactive classes={classes}>
      {children}
    </Tooltip>
  );
};

export const StyledTabs = withStyles(() => createStyles({
  root: {
    flex: 1,
  },
  indicator: {
    backgroundColor: '#12D6D6',
    height: '4px',
  },
}))(Tabs);

export const StyledTab = withStyles((theme: Theme) => createStyles({
  root: {
    fontSize: '16px',
    fontWeight: theme.typography.fontWeightLight,
    textTransform: 'none',
    '&:focus': {
      color: theme.palette.foreground.two,
    },
  },
}))(Tab);

export const StyledTableHeaderCell = withStyles((theme: Theme) => createStyles({
  root: {
    fontWeight: theme.typography.fontWeightLight,
    fontSize: '14px',
    borderBottom: 'none',
  },
}))(TableCell);

export const StyledTableCell = withStyles((theme: Theme) => createStyles({
  root: {
    fontWeight: theme.typography.fontWeightLight,
    fontSize: '14px',
    color: '#748790',
    backgroundColor: theme.palette.foreground.grey3,
    borderWidth: theme.spacing(1),
    borderColor: theme.palette.background.default,
  },
}))(TableCell);

export const StyledLeftTableCell = withStyles((theme: Theme) => createStyles({
  root: {
    borderRadius: theme.shape.leftRoundedBorderRadius.large,
  },
}))(StyledTableCell);

export const StyledRightTableCell = withStyles((theme: Theme) => createStyles({
  root: {
    borderRadius: theme.shape.rightRoundedBorderRadius.large,
  },
}))(StyledTableCell);

// These are for use in Tables that are children of other tables.
export const StyledSmallTableCell = withStyles((theme: Theme) => createStyles({
  root: {
    fontWeight: theme.typography.fontWeightLight,
    backgroundColor: theme.palette.foreground.grey2,
    borderWidth: 0,
  },
}))(StyledTableCell);

export const StyledSmallLeftTableCell = withStyles((theme: Theme) => createStyles({
  root: {
    borderRadius: theme.shape.leftRoundedBorderRadius.small,
  },
}))(StyledSmallTableCell);

export const StyledSmallRightTableCell = withStyles((theme: Theme) => createStyles({
  root: {
    borderRadius: theme.shape.rightRoundedBorderRadius.small,
  },
}))(StyledSmallTableCell);

export const LiveViewButton = withStyles((theme: Theme) => createStyles({
  root: {
    color: theme.palette.foreground.grey5,
  },
}))(({ classes }: any) => (
  <Button classes={classes} component={Link} to='/live'>
    Live View
  </Button>
));

withStyles((theme: Theme) => createStyles({
  root: {
    fontWeight: theme.typography.fontWeightLight,
    fontSize: '14px',
    color: '#748790',
    backgroundColor: theme.palette.foreground.grey3,
    borderWidth: 8,
    borderColor: theme.palette.background.default,
  },
}))(TableCell);
