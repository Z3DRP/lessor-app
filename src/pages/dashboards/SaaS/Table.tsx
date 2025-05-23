import React from "react";
import styled from "@emotion/styled";
import { MoreVertical } from "lucide-react";

import {
  Card as MuiCard,
  CardHeader,
  IconButton,
  Chip as MuiChip,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { spacing } from "@mui/system";

const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)<{ color: string }>`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;

const Paper = styled(MuiPaper)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)});
`;

// Data
let id = 0;
function createData(
  name: string,
  license: string,
  tech: JSX.Element,
  tickets: number,
  sales: number
) {
  id += 1;
  return { id, name, license, tech, tickets, sales };
}

const rows = [
  createData(
    "Aurora",
    "Single License",
    <Chip label="React" color="success" />,
    12,
    1205
  ),
  createData(
    "Canary",
    "Single License",
    <Chip label="React" color="success" />,
    1,
    410
  ),
  createData(
    "Eagle",
    "Extended License",
    <Chip label="Angular" color="warning" />,
    2,
    108
  ),
  createData(
    "Fireball",
    "Single License",
    <Chip label="React" color="success" />,
    3,
    360
  ),
  createData(
    "Omega",
    "Single License",
    <Chip label="Angular" color="warning" />,
    6,
    712
  ),
  createData(
    "Yoda",
    "Extended License",
    <Chip label="Angular" color="success" />,
    15,
    1502
  ),
  createData(
    "Zulu",
    "Extended License",
    <Chip label="Angular" color="success" />,
    2,
    480
  ),
];

const DashboardTable = () => (
  <Card mb={6}>
    <CardHeader
      action={
        <IconButton aria-label="settings" size="large">
          <MoreVertical />
        </IconButton>
      }
      title="Latest products"
    />
    <Paper>
      <TableWrapper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>License Type</TableCell>
              <TableCell>Technology</TableCell>
              <TableCell>Open Tickets</TableCell>
              <TableCell>Sales</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.license}</TableCell>
                <TableCell>{row.tech}</TableCell>
                <TableCell>{row.tickets}</TableCell>
                <TableCell>{row.sales}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </Paper>
  </Card>
);

export default DashboardTable;
