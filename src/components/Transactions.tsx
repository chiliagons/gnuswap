import { Grid, Button, TextField, Select, MenuItem, Card, Paper, Container} from "@material-ui/core";
import styled from 'styled-components';

export default function Transaction(){
    const Container = styled.form`
    margin-bottom: 2rem;
    width: 100%;
  
    margin-top: 20px;
    margin-left: 20px;
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
  `;
    return (
        <>
        <Container>
            <Paper>Hi</Paper>
        </Container>
            </>
    );
}