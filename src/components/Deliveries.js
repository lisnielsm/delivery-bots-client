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
import moment from "moment";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

// Redux 
import { useSelector, useDispatch } from 'react-redux';
import { getDeliveriesAction, changeDeliveryStatusAction, deleteDeliveryAction, getEditDeliveryAction } from '../actions/deliveryActions';

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
            id: 'options',
            label: 'Options',
            minWidth: 120,
            align: "center"
        },
        {
            id: '_state',
            label: 'State',
            minWidth: 140,
            align: "center"
        },
        {
            id: 'creation_date',
            label: 'Creation Date',
            minWidth: 180,
            align: "center"
        },
        {
            id: 'pickup_lat',
            label: 'Pickup Latitude',
            minWidth: 150,
            align: "center"
        },
        {
            id: 'pickup_lon',
            label: 'Pickup Longitude',
            minWidth: 150,
            align: "center"
        },
        {
            id: 'dropoff_lat',
            label: 'Dropoff Latitude',
            minWidth: 150,
            align: "center"
        },
        {
            id: 'dropoff_lon',
            label: 'Dropoff Longitude',
            minWidth: 150,
            align: "center"
        },
        {
            id: 'zone_id',
            label: 'Zone ID',
            minWidth: 250,
            align: 'center'
        },
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
            state: mState,
            creation_date: moment(delivery.creation_date).format("MM/DD/YYYY hh:mma"),
            pickup_lat: delivery.pickup.pickup_lat,
            pickup_lon: delivery.pickup.pickup_lon,
            dropoff_lat: delivery.dropoff.dropoff_lat,
            dropoff_lon: delivery.dropoff.dropoff_lon,
            zone_id: delivery.zone_id,
            id: delivery.id,
        }
    })

    console.log("Rows", rows)

    const getDeliveryStateClass = (delivery) => {

        let stateClass;

        if (delivery.state === "Pending") {
            stateClass = classes.pendingState;
        } else if (delivery.state === "Assigned") {
            stateClass = classes.assignedState;
        } else if (delivery.state === "In Transit") {
            stateClass = classes.inTransitState;
        } else if (delivery.state === "Delivered") {
            stateClass = classes.deliveredState;
        }

        return stateClass;
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

    const changeDeliveryStatus = row => {
        const currentState = row.state;
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

        dispatch(changeDeliveryStatusAction({ id: row.id, state: nextState }, currentState, nextStateStr))
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
        const delivery = deliveries.filter(delivery => delivery.id === id)[0];

        console.log(delivery)

        dispatch(getEditDeliveryAction(delivery));
        // redirect
        return navigate(`/deliveries/edit/${delivery.id}`);
    }

    return (
        <>
            <h2 className="text-center mt-4" style={{ color: "#3f51b5", fontWeight: "700" }}>Deliveries List</h2>

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
                                        // align={column.align}
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
                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.id ? row.id : row.creation_date + row.pickup_lat + row.pickup_lon}>
                                            <TableCell className={classes.root}>
                                                <IconButton onClick={() => goToDeliveryEdit(row.id)}>
                                                    <EditIcon color="primary" />
                                                </IconButton>
                                                <IconButton onClick={() => confirmDeleteDelivery(row.id)}>
                                                    <DeleteIcon style={{ color: "var(--bs-red)" }} />
                                                </IconButton>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    className={getDeliveryStateClass(row)}
                                                    size="small"
                                                    onClick={() => changeDeliveryStatus(row)}
                                                >
                                                    {row.state}
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
                    to="/deliveries/new"
                    variant="outlined"
                    className="newDeliveryBtn greyShadow my-4"
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