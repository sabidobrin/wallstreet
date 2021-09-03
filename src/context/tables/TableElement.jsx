//import React, { useState, useEffect } from 'react';
import './tables.css';
import ReactTable from 'react-table';

export default function TableElement (props) {

    return (
        <ReactTable className="-highlight" data={props.data} columns={props.columns} filterable={false}
            sortable={props.data.length > 1 ? true : false} //NoDataComponent={() => <NullField />}
        />
    );
}