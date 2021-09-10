import ReactTable from 'react-table';
import 'react-table/react-table.css';
import '../tables.css';

export default function CallPutTable (props) {

    return <ReactTable
                columns={props.columns} data={props.data}
                sortable={false} filterable={false}
                showPagination={false}
                minRows={0} className="-highlight"
                NoDataComponent={() => <span/>}
                //SubComponent={row => { return <span>{JSON.stringify(row)}</span>}}
                SubComponent={row => {
                    return <ReactTable columns={props.subColumns} data={props.subData}
                        sortable={false} filterable={false} showPagination={false} minRows={0}
                        NoDataComponent={() => <span/>}
                    />}}
            />
}