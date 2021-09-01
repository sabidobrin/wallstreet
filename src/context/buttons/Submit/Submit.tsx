import '../buttons.css';
import { Button } from 'react-bootstrap';

export default function Submit (props: any) {
    return <Button type="submit" id="submit-button" /*onClick={props.handleSubmit}*/ variant="contained" size="sm">Calculate</Button>
}