import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default function TableElement (props) {

    return <ReactTable
                columns={props.columns} data={props.data}
                sortable={false} filterable={false}
                showPagination={false}
                minRows={3} className="-highlight"
            />
}