import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

// Redux 
import { useSelector, useDispatch } from 'react-redux';
import { getBotsAction, changeBotStatusAction, deleteBotAction, getEditBotAction } from '../actions/botsActions';

const useStyles = makeStyles({
    root: {
        "& .MuiTableCell-head": {
            color: "white",
            backgroundColor: "#3f51b5"
        },

        "& .MuiTablePagination-select": {
            paddingBottom: "0.2rem !important"
        },

        "& .MuiTablePagination-selectLabel": {
            marginBottom: "0 !important"
        },

        "& .MuiTablePagination-displayedRows": {
            marginBottom: "0 !important"
        },

        "& .MuiButtonBase-root.MuiIconButton-root": {
            padding: "8px"
        }
    },

    availableStatus: {
        color: "#FFF",
        backgroundColor: "var(--bs-green)",
        marginTop: "0.25rem",
        marginBottom: "0.25rem",
        width: "100%",
        textTransform: "none",
        borderRadius: "15px",

        "&:hover": {
            backgroundColor: "#00592b"
        }
    },

    busyStatus: {
        color: "#FFF",
        backgroundColor: "var(--bs-orange)",
        marginTop: "0.25rem",
        marginBottom: "0.25rem",
        width: "100%",
        textTransform: "none",
        borderRadius: "15px",

        "&:hover": {
            backgroundColor: "#c34f00"
        }
    },

    reservedStatus: {
        color: "#FFF",
        backgroundColor: "var(--bs-red)",
        marginTop: "0.25rem",
        marginBottom: "0.25rem",
        width: "100%",
        textTransform: "none",
        borderRadius: "15px",

        "&:hover": {
            backgroundColor: "#a3001e"
        }
    }
});

const Bots = () => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const navigate = useNavigate();

    // get the state
    const bots = useSelector(state => state.bots.bots);
    const error = useSelector(state => state.bots.error);
    const loading = useSelector(state => state.bots.loading);

    useEffect(() => {

        // query the api
        const loadBots = () => dispatch(getBotsAction());

        loadBots();

        // eslint-disable-next-line
    }, []);

    const columns = [
        {
            id: 'options',
            label: 'Options',
            minWidth: 120
        },
        {
            id: '_status',
            label: 'Status',
            minWidth: 140
        },
        {
            id: 'code',
            label: 'Code',
            minWidth: 150
        },
        {
            id: 'dropoff_lat',
            label: 'Dropoff Latitude',
            minWidth: 150
        },
        {
            id: 'dropoff_lon',
            label: 'Dropoff Longitude',
            minWidth: 150
        },
        {
            id: 'zone_id',
            label: 'Zone ID',
            minWidth: 250
        },
    ];

    const rows = bots.map(bot => {
        let mStatus = "";

        if (bot.status === "available") {
            mStatus = "Available"
        } else if (bot.status === "busy") {
            mStatus = "Busy"
        } else if (bot.status === "reserved") {
            mStatus = "Reserved"
        } else {
            mStatus = "Unknow"
        }

        return {
            code: bot.code,
            status: mStatus,
            dropoff_lat: bot.location.dropoff_lat,
            dropoff_lon: bot.location.dropoff_lon,
            zone_id: bot.zone_id,
            id: bot.id,
        }
    })

    const getBotStatusClass = (bot) => {

        let statusClass;

        if (bot.status === "Available") {
            statusClass = classes.availableStatus;
        } else if (bot.status === "Busy") {
            statusClass = classes.busyStatus;
        } else if (bot.status === "Reserved") {
            statusClass = classes.reservedStatus;
        }

        return statusClass;
    }

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const changeBotStatus = row => {
        const currentStatus = row.status;
        let nextStatus = "";
        let nextStatusStr = "";

        if (currentStatus === "Available") {
            nextStatus = "busy";
            nextStatusStr = "Busy";
        } else if (currentStatus === "Busy") {
            nextStatus = "reserved";
            nextStatusStr = "Reserved";
        } else if (currentStatus === "Reserved") {
            nextStatus = "available";
            nextStatusStr = "Available";
        } else {
            nextStatus = "unknown";
            nextStatusStr = "Unknown";
        }

        dispatch(changeBotStatusAction({ id: row.id, status: nextStatus }, currentStatus, nextStatusStr))
    }

    // confirm if user want  to delete teh bot
    const confirmDeleteBot = id => {

        Swal.fire({
            title: '¿Are you sure?',
            text: "A product that is deleted cannot be recovered",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3f51b5',
            cancelButtonColor: 'var(--bs-red)',
        }).then(result => {
            if (result.value) {
                dispatch(deleteBotAction(id));
            }
        })
    }

    // function that redirect in controlled way
    const goToBotEdit = id => {
        //get the bot by this id
        const bot = bots.filter(bot => bot.id === id)[0];

        dispatch(getEditBotAction(bot));
        // redirect
        return navigate(`/bots/edit/${bot.id}`);
    }

    return (
        <>
            <h2 className="text-center mt-4" style={{ color: "#3f51b5", fontWeight: "700" }}>Bots List</h2>

            {error ? <p className="font-weight-bold alert alert-danger text-center mt-4">There was an error</p> : null}

            {loading ? <p className="text-center">Loading...</p> : null}

            <Paper elevation={8} sx={{ width: '100%', overflow: 'hidden', marginTop: "2rem" }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow className={classes.root}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id ? row.id : row.code}>
                                            <TableCell className={classes.root}>
                                                <IconButton onClick={() => goToBotEdit(row.id)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={() => confirmDeleteBot(row.id)}>
                                                    <DeleteIcon style={{ color: "var(--bs-red)" }} />
                                                </IconButton>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    className={getBotStatusClass(row)}
                                                    size="small"
                                                    onClick={() => changeBotStatus(row)}
                                                >
                                                    {row.status}
                                                </Button>
                                            </TableCell>

                                            {columns.map((column) => {
                                                const value = row[column.id];

                                                if (!value) return null;

                                                return (
                                                    <TableCell key={column.id} >
                                                        {value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    className={classes.root}
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>

            <div className="d-flex justify-content-end w-100">
                <Button
                    component={Link}
                    to="/bots/new"
                    variant="outlined"
                    className="newBtn greyShadow my-4"
                    startIcon={<AddIcon />}
                    size="large"
                    color="primary"
                >
                    New Bot
                </Button>
            </div>

        </>
    );
}

export default Bots;