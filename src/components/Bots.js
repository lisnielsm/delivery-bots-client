import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Button, IconButton, makeStyles, Popover, Tooltip } from '@material-ui/core';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';
import moment from "moment";

import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

// Redux 
import { useSelector, useDispatch } from 'react-redux';
import { getBotsAction, changeBotStatusAction, deleteBotAction, getEditBotAction, getAssignBotAction, assignBotAction } from '../actions/botsActions';
import { DataGrid } from '@mui/x-data-grid';
import { getDeliveriesAction } from '../actions/deliveryActions';
import { Stack } from '@mui/material';

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
    },

    popoverRoot: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const Bots = () => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const navigate = useNavigate();

    const [pageSize, setPageSize] = useState(25);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectionModel, setSelectionModel] = useState([]);
    const [reload, setReload] = useState(true);

    // get the state
    const bots = useSelector(state => state.bots.bots);
    const error = useSelector(state => state.bots.error);
    const loading = useSelector(state => state.bots.loading);
    const deliveries = useSelector(state => state.deliveries.deliveries);
    const assignbot = useSelector(state => state.bots.assignbot);

    useEffect(() => {

        const getBotsAndDeliveries = () => {
            // query the api
            dispatch(getBotsAction());
            dispatch(getDeliveriesAction());
        }

        getBotsAndDeliveries();

        // eslint-disable-next-line
    }, [reload]);

    const idDeliveries = Boolean(anchorEl) ? 'simple-popover' : undefined;

    const columns = [
        {
            field: 'col1',
            headerName: 'Options',
            width: 150,
            sortable: false,
            renderCell: (cellValues) => {
                return (
                    <div className={classes.root}>
                        <Tooltip title="Edit Bot" placement="bottom">
                            <div className="d-inline">
                                <IconButton onClick={() => goToBotEdit(cellValues.id)}>
                                    <EditIcon color="primary" />
                                </IconButton>
                            </div>
                        </Tooltip>

                        <Tooltip title="Delete Bot" placement="bottom">
                            <div className="d-inline">
                                <IconButton onClick={() => confirmDeleteBot(cellValues.id)}>
                                    <DeleteIcon style={{ color: "var(--bs-red)" }} />
                                </IconButton>
                            </div>
                        </Tooltip>

                        <Tooltip title="Assign Bot" placement="bottom">
                            <div className="d-inline">
                                <IconButton onClick={(event) => {
                                    if (assignCurrentBot(cellValues.row)) {
                                        setAnchorEl(event.currentTarget);
                                    }
                                }}>
                                    <AssignmentIcon style={{ color: "var(--bs-orange)" }} />
                                </IconButton>
                            </div>
                        </Tooltip>
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
        { field: 'col6', headerName: 'Zone ID', width: 200 },
        { field: 'col7', headerName: 'Delivery Code', width: 180 },
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
            col4: bot.location.dropoff_lat ? bot.location.dropoff_lat : "-",
            col5: bot.location.dropoff_lon ? bot.location.dropoff_lon : "-",
            col6: bot.zone_id ? bot.zone_id : "-",
            col7: bot.delivery_code ? bot.delivery_code : "-"
        }
    })

    const columnsDeliveries = [
        { field: 'col1', headerName: 'State', width: 140 },
        { field: 'col2', headerName: 'Code', width: 180 },
        { field: 'col3', headerName: 'Creation Date', width: 180 },
        { field: 'col4', headerName: 'Pickup Latitude', width: 150 },
        { field: 'col5', headerName: 'Pickup Longitude', width: 150 },
        { field: 'col6', headerName: 'Dropoff Latitude', width: 150 },
        { field: 'col7', headerName: 'Dropoff Longitude', width: 140 },
        { field: 'col8', headerName: 'Zone ID', width: 250 },
    ];

    const getDeliveriesRows = () => {
        return deliveries.filter(delivery => delivery.state === "pending").map(delivery => {
            let mState = "";

            if (delivery.state === "pending") {
                mState = "Pending"
            } else if (delivery.state === "assigned") {
                mState = "Assigned"
            } else if (delivery.state === "in_transit") {
                mState = "In Transit"
            } else if (delivery.state === "delivered") {
                mState = "Delivered"
            } else {
                mState = "Unknow"
            }

            return {
                id: delivery.id,
                col1: mState,
                col2: delivery.code,
                col3: moment(delivery.creation_date).format("MM/DD/YYYY hh:mma"),
                col4: delivery.pickup.pickup_lat,
                col5: delivery.pickup.pickup_lon,
                col6: delivery.dropoff.dropoff_lat,
                col7: delivery.dropoff.dropoff_lon,
                col8: delivery.zone_id,
            }
        })
    }

    const rowDeliveries = getDeliveriesRows();

    const assignCurrentBot = row => {

        if (row.col2 !== "Available") {
            // Alert 
            Swal.fire(
                'Bot is in ' + row.col2 + " status",
                'The bot must be in the Available state to assign a delivery to it',
                'warning'
            );

            return false;
        }

        const cBot = bots.find(currentBot => currentBot.code === row.col3);

        dispatch(getAssignBotAction(cBot));

        return true;
    }

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

        let bot = {
            id: row.id,
            location: {
                dropoff_lat: "",
                dropoff_lon: ""
            },
            zone_id: "",
            delivery_code: ""
        }

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

        bot.status = nextStatus;

        dispatch(changeBotStatusAction(bot, currentStatus, nextStatusStr))
    }

    // confirm if user want to delete the bot
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

    const sendDeliveryToBot = () => {
        const bot = assignbot;

        const deliveryId = selectionModel[0];

        const selectedDelivery = deliveries.find(delivery => delivery.id === deliveryId);

        bot.delivery_code = selectedDelivery.code;

        dispatch(assignBotAction(bot));

        setTimeout(function () {
            setReload(!reload);
        }, 300);

        setAnchorEl(null);
    }

    return (
        <>
            <h2 className="text-center mt-4" style={{ color: "#3f51b5", fontWeight: "700" }}>Bots List</h2>

            {error ? <p className="font-weight-bold alert alert-danger text-center mt-4">There was an error</p> : null}

            {loading ? <p className="text-center">Loading...</p> : null}

            <Paper elevation={8} sx={{ height: "500px", width: '100%', overflow: 'hidden', marginTop: "2rem" }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    className={classes.root}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    pagination
                    components={{
                        NoRowsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                                No bots, create a new one
                            </Stack>
                        ),
                        NoResultsOverlay: () => (
                            <Stack height="100%" alignItems="center" justifyContent="center">
                                Local filter returns no result
                            </Stack>
                        )
                    }}
                    onCellClick={handleCellClick}
                    onRowClick={handleRowClick}
                />
            </Paper>

            <Popover
                id={idDeliveries}
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => {
                    setAnchorEl(null);
                }}
                anchorReference={"none"}
                className={classes.popoverRoot}
                transformOrigin={{
                    horizontal: "center",
                    vertical: "top",
                }}
                anchorOrigin={{
                    horizontal: "center",
                    vertical: "bottom",
                }}
            >
                <div className="popoverBot">
                    <div className="d-flex flex-column w-100 h-100">

                        <div className="mb-3" style={{ color: "#3f51b5", fontWeight: "700", fontSize: "20px" }}>Choose a delivery</div>

                        <DataGrid
                            id="deliveriesList"
                            rows={rowDeliveries}
                            columns={columnsDeliveries}
                            className={classes.root + " deliveriesList"}
                            pageSize={pageSize}
                            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                            rowsPerPageOptions={[10, 25, 50, 100]}
                            pagination
                            checkboxSelection
                            selectionModel={selectionModel}
                            hideFooterSelectedRowCount
                            onSelectionModelChange={(selection) => {
                                if (selection.length > 1) {
                                    const selectionSet = new Set(selectionModel);
                                    const result = selection.filter((s) => !selectionSet.has(s));

                                    setSelectionModel(result);
                                } else {
                                    setSelectionModel(selection);
                                }
                            }}
                            onCellClick={handleCellClick}
                            onRowClick={handleRowClick}
                        />

                        <div className="d-flex flex-column flex-sm-row w-100">
                            <Button
                                variant="contained"
                                className="mt-4 me-0 me-sm-2 w-100"
                                size="large"
                                color="default"
                                onClick={() => {
                                    setAnchorEl(null);
                                }}
                            >
                                Back
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                className="mt-4 ms--0 ms-sm-2 w-100"
                                size="large"
                                color="primary"
                                onClick={sendDeliveryToBot}
                            >
                                Assign
                            </Button>
                        </div>
                    </div>
                </div>
            </Popover>

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