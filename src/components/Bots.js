import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';

import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

// Redux 
import { useSelector, useDispatch } from 'react-redux';
import { getBotsAction, changeBotStatusAction, deleteBotAction, getEditBotAction } from '../actions/botsActions';
import { DataGrid } from '@mui/x-data-grid';

const useStyles = makeStyles({
    root: {

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
        },

        "& .MuiDataGrid-columnHeaders": {
            color: "white",
            backgroundColor: "#3f51b5"
        },

        "& .MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeSmall": {
            color: "white"
        },

        "& .MuiDataGrid-columnSeparator svg": {
            height: "100%"
        },

        "& .MuiDataGrid-columnHeader": {
            outline: "none !important"
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

    const [pageSize, setPageSize] = useState(5);

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
            field: 'col1',
            headerName: 'Options',
            width: 150,
            sortable: false,
            renderCell: (cellValues) => {
                return (
                    <div className={classes.root}>
                        <IconButton onClick={() => goToBotEdit(cellValues.id)}>
                            <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => confirmDeleteBot(cellValues.id)}>
                            <DeleteIcon style={{ color: "var(--bs-red)" }} />
                        </IconButton>
                        <IconButton onClick={() => console.log("Entro a Assignment")}>
                            <AssignmentIcon style={{ color: "var(--bs-orange)" }} />
                        </IconButton>
                    </div>
                );
            }
        },
        {
            field: 'col2',
            headerName: 'State',
            width: 140,
            renderCell: (cellValues) => {
                return (
                    <Button
                        variant="contained"
                        className={getBotStatusClass(cellValues.row)}
                        size="small"
                        onClick={() => changeBotStatus(cellValues.row)}
                    >
                        {cellValues.row.col2}
                    </Button>
                );
            }
        },
        { field: 'col3', headerName: 'Code', width: 180 },
        { field: 'col4', headerName: 'Dropoff Latitude', width: 150 },
        { field: 'col5', headerName: 'Dropoff Longitude', width: 140 },
        { field: 'col6', headerName: 'Zone ID', width: 250 },
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
            id: bot.id,
            col2: mStatus,
            col3: bot.code,
            col4: bot.location.dropoff_lat,
            col5: bot.location.dropoff_lon,
            col6: bot.zone_id,
        }
    })

    const getBotStatusClass = (bot) => {

        let statusClass;

        if (bot.col2 === "Available") {
            statusClass = classes.availableStatus;
        } else if (bot.col2 === "Busy") {
            statusClass = classes.busyStatus;
        } else if (bot.col2 === "Reserved") {
            statusClass = classes.reservedStatus;
        }

        return statusClass;
    }

    const handleCellClick = (param, event) => {
        event.stopPropagation();
    };

    const handleRowClick = (param, event) => {
        event.stopPropagation();
    };

    const changeBotStatus = row => {
        const currentStatus = row.col2;
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
        const bot = bots.find(bot => bot.id === id);

        dispatch(getEditBotAction(bot));
        // redirect
        return navigate(`/bots/edit/${bot.id}`);
    }

    return (
        <>
            <h2 className="text-center mt-4" style={{ color: "#3f51b5", fontWeight: "700" }}>Bots List</h2>

            {error ? <p className="font-weight-bold alert alert-danger text-center mt-4">There was an error</p> : null}

            {loading ? <p className="text-center">Loading...</p> : null}

            <Paper elevation={8} sx={{ height: "600px", width: '100%', overflow: 'hidden', marginTop: "2rem" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    className={classes.root}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[5, 20, 100]}
                    pagination
                    onCellClick={handleCellClick}
                    onRowClick={handleRowClick}
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