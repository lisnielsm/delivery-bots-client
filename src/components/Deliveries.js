import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { Button, IconButton, makeStyles } from '@material-ui/core';
import { Link } from "react-router-dom";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';

import { getDeliveriesAction, changeDeliveryStateAction, deleteDeliveryAction, getEditDeliveryAction } from '../actions/deliveryActions';

// Redux 
import { useSelector, useDispatch } from 'react-redux';

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

    pendingState: {
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

    assignedState: {
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

    inTransitState: {
        color: "#FFF",
        backgroundColor: "var(--bs-pink)",
        marginTop: "0.25rem",
        marginBottom: "0.25rem",
        width: "100%",
        textTransform: "none",
        borderRadius: "15px",

        "&:hover": {
            backgroundColor: "#a00057"
        }
    },

    deliveredState: {
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

const Deliveries = () => {

    const dispatch = useDispatch();
    const classes = useStyles();
    const navigate = useNavigate();

    const [pageSize, setPageSize] = useState(20);

    // get the state
    const deliveries = useSelector(state => state.deliveries.deliveries);
    const error = useSelector(state => state.deliveries.error);
    const loading = useSelector(state => state.deliveries.loading);

    useEffect(() => {

        // query the api
        const loadDeliveries = () => dispatch(getDeliveriesAction());

        loadDeliveries();

        // eslint-disable-next-line
    }, []);

    const columns = [
        { 
            field: 'col1', 
            headerName: 'Options', 
            width: 120,
            sortable: false,
            renderCell: (cellValues) => {
                return (
                    <div className={classes.root}>
                        <IconButton onClick={() => goToDeliveryEdit(cellValues.id)}>
                            <EditIcon color="primary" />
                        </IconButton>
                        <IconButton onClick={() => confirmDeleteDelivery(cellValues.id)}>
                            <DeleteIcon style={{ color: "var(--bs-red)" }} />
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
                        className={getDeliveryStateClass(cellValues.row)}
                        size="small"
                        onClick={() => changeDeliveryStatus(cellValues.row)}
                    >
                        {cellValues.row.col2}
                    </Button>
                );
            }
        },
        { field: 'col3', headerName: 'Creation Date', width: 180 },
        { field: 'col4', headerName: 'Pickup Latitude', width: 150 },
        { field: 'col5', headerName: 'Pickup Longitude', width: 150 },
        { field: 'col6', headerName: 'Dropoff Latitude', width: 150 },
        { field: 'col7', headerName: 'Dropoff Longitude', width: 140 },
        { field: 'col8', headerName: 'Zone ID', width: 250 },
    ];

    const rows = deliveries.map(delivery => {
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
            col2: mState,
            col3: moment(delivery.creation_date).format("MM/DD/YYYY hh:mma"),
            col4: delivery.pickup.pickup_lat,
            col5: delivery.pickup.pickup_lon,
            col6: delivery.dropoff.dropoff_lat,
            col7: delivery.dropoff.dropoff_lon,
            col8: delivery.zone_id
        }
    });

    const getDeliveryStateClass = (delivery) => {

        let stateClass;

        if (delivery.col2 === "Pending") {
            stateClass = classes.pendingState;
        } else if (delivery.col2 === "Assigned") {
            stateClass = classes.assignedState;
        } else if (delivery.col2 === "In Transit") {
            stateClass = classes.inTransitState;
        } else if (delivery.col2 === "Delivered") {
            stateClass = classes.deliveredState;
        }

        return stateClass;
    }

    const handleCellClick = (param, event) => {
        event.stopPropagation();
    };

    const handleRowClick = (param, event) => {
        event.stopPropagation();
    };

    const changeDeliveryStatus = row => {
        const currentState = row.col2;
        let nextState = "";
        let nextStateStr = "";

        if (currentState === "Pending") {
            nextState = "assigned";
            nextStateStr = "Assigned";
        } else if (currentState === "Assigned") {
            nextState = "in_transit";
            nextStateStr = "In Transit";
        } else if (currentState === "In Transit") {
            nextState = "delivered";
            nextStateStr = "Delivered";
        } else if (currentState === "Delivered") {
            nextState = "pending";
            nextStateStr = "Pending";
        } else {
            nextState = "unknown";
            nextStateStr = "Unknown";
        }

        dispatch(changeDeliveryStateAction({ id: row.id, state: nextState }, currentState, nextStateStr))
    }

    // confirm if user want  to delete teh delivery
    const confirmDeleteDelivery = id => {

        Swal.fire({
            title: '¿Are you sure?',
            text: "A product that is deleted cannot be recovered",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3f51b5',
            cancelButtonColor: 'var(--bs-red)',
        }).then(result => {
            if (result.value) {
                dispatch(deleteDeliveryAction(id));
            }
        })
    }

    // function that redirect in controlled way
    const goToDeliveryEdit = id => {
        //get the delivery by this id
        const delivery = deliveries.find(delivery => delivery.id === id);

        dispatch(getEditDeliveryAction(delivery));
        // redirect
        return navigate(`/deliveries/edit/${delivery.id}`);
    }

    return (
        <>
            <h2 className="text-center mt-4" style={{ color: "#3f51b5", fontWeight: "700" }}>Deliveries List</h2>

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
                    to="/deliveries/new"
                    variant="outlined"
                    className="newBtn greyShadow my-4"
                    startIcon={<AddIcon />}
                    size="large"
                    color="primary"
                >
                    New Delivery
                </Button>
            </div>

        </>
    );
}

export default Deliveries;