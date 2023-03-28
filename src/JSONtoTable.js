// import {useMemo} from 'react';
import { Table, TableBody, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import {useTable} from 'react-table';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));


function JSONtoTable({data}) {

    // const columns = useMemo(() => [                            // useMemo to prevent re-renders of useTable
    //     { Header: 'InstrumentId', accessor: 'instrumentId' },
    //     { Header: 'Actual', accessor: 'actual' },
    //     { Header: 'Predicted', accessor: 'predicted' },
    //     { Header: 'Diff', accessor: 'diff' },
    //   ],[]);
    
    // const tablefromJSON = useTable({ columns, data });

    return (
    <TableContainer component={Paper} style={{margin: "10px", overflowX: "auto", height: "fit-content", alignSelf: "center"}}>
    <Table> 
      <TableHead>
        <StyledTableRow>
        {/* {
            ['instrumentId','actual','predicted','diff'].forEach((x) =>
                {<TableCell style={{backgroundColor: "black", color: "white"}}>{x.toUpperCase()}</TableCell>}
            )
        } */}
          <StyledTableCell style={{backgroundColor: "black", color: "white"}}>INSTRUMENTID</StyledTableCell>
          <StyledTableCell style={{backgroundColor: "black", color: "white"}}>ACTUAL</StyledTableCell>
          <StyledTableCell style={{backgroundColor: "black", color: "white"}}>PREDICTED</StyledTableCell>
          <StyledTableCell style={{backgroundColor: "black", color: "white"}}>DIFF</StyledTableCell>
        </StyledTableRow>
      </TableHead>
      <TableBody>
        {data.map((item) => (
          <StyledTableRow key={item.instrumentId}>
            <StyledTableCell>{item.instrumentId}</StyledTableCell>
            <StyledTableCell>{item.actual}</StyledTableCell>
            <StyledTableCell>{item.predicted}</StyledTableCell>
            <StyledTableCell>{item.diff}</StyledTableCell>
          </StyledTableRow>
        ))}
      </TableBody>
    </Table>
    </TableContainer>

  
    );
};

export default JSONtoTable;