import { useState, useEffect } from "react";
import dayjs from "dayjs";

import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import UploadAndDisplayImage from "./Upload";
import { API_BASE_URL } from "../api/api";

const EditResult = ({
  users,
  setResult,
  result,
  pets,
  setImageId,
  selectedImage,
  setSelectedImage,
  onUpdate,
  setEditing,
}) => {
  useEffect(() => {
    console.log(result)
    setSelectedImage(`${API_BASE_URL}${result.data}`)
  }, [])
  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ minWidth: 230, marginTop: 3, maxWidth: 300 }}>
        <FormControl>
          <InputLabel id="user-select">Selecione um cliente</InputLabel>
          <Select
            labelId="user-select"
            style={{ width: 200 }}
            id="user-select"
            value={!!users && users.length && result.userId}
            placeholder="Selecione o cliente"
            onChange={(e) => setResult({ ...result, userId: e.target.value })}
          >
            {!!users?.length &&
              users.map((u) => <MenuItem value={u.id}>{u.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 220, marginTop: 3, maxWidth: 200 }}>
        <FormControl>
          <InputLabel id="user-select">Selecione o Pet</InputLabel>
          <Select
            labelId="pet-select"
            id="pet-select"
            style={{ width: 200 }}
            value={!!pets && pets.length && result.petId}
            placeholder="Selecione o pet do cliente"
            onChange={(e) => setResult({ ...result, petId: e.target.value })}
          >
            {!!pets?.length && result.userId ? (
              pets
                .filter((p) => p.userId === result.userId)
                .map((p) => <MenuItem value={p.id}>{p.name}</MenuItem>)
            ) : (
              <MenuItem value={null}>Selecione um cliente primeiro</MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
      <div style={{ margin: 5 }}>
        <UploadAndDisplayImage
          setImageId={setImageId}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      </div>
      <Button
        style={{
          backgroundColor: "#80C197",
          color: "#fff",
          padding: "0 40px",
          height: 45,
          margin: "auto",
        }}
        onClick={() => {
          onUpdate({
            id: result.id,
            userId: result.userId,
            petId: result.petId,
            imageId: result.imageId,
            date: dayjs().toJSON(),
          });
          setEditing(false);
          setResult({
            userId: null,
            petId: null,
            date: dayjs().toJSON(),
            imageId: null,
          });
          //setFilter();
        }}
      >
        Salvar
      </Button>
    </div>
  );
};
const CreateResult = ({
  users,
  setResult,
  result,
  pets,
  setImageId,
  selectedImage,
  setSelectedImage,
  onRegister,
  setCreating,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <Box sx={{ minWidth: 230, marginTop: 3, maxWidth: 300 }}>
        <FormControl>
          <InputLabel id="user-select">Selecione um cliente</InputLabel>
          <Select
            labelId="user-select"
            style={{ width: 200 }}
            id="user-select"
            value={!!users && users.length && result.userId}
            placeholder="Selecione o cliente"
            onChange={(e) => setResult({ ...result, userId: e.target.value })}
          >
            {!!users?.length &&
              users.map((u) => <MenuItem value={u.id}>{u.name}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ minWidth: 220, marginTop: 3, maxWidth: 200 }}>
        <FormControl>
          <InputLabel id="user-select">Selecione o Pet</InputLabel>
          <Select
            labelId="pet-select"
            id="pet-select"
            style={{ width: 200 }}
            value={!!pets && pets.length && result.petId}
            placeholder="Selecione o pet do cliente"
            onChange={(e) => setResult({ ...result, petId: e.target.value })}
          >
            {!!pets?.length && result.userId ? (
              pets
                .filter((p) => p.userId === result.userId)
                .map((p) => <MenuItem value={p.id}>{p.name}</MenuItem>)
            ) : (
              <MenuItem value={null}>Selecione um cliente primeiro</MenuItem>
            )}
          </Select>
        </FormControl>
      </Box>
      <div style={{ margin: 5 }}>
        <UploadAndDisplayImage
          setImageId={setImageId} //
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      </div>
      <Button
        style={{
          backgroundColor: "#80C197",
          color: "#fff",
          padding: "0 40px",
          height: 45,
          margin: "auto",
        }}
        onClick={() => {
          onRegister(result);
          setCreating(false);
          setResult({
            userId: null,
            petId: null,
            date: dayjs().toJSON(),
            imageId: null,
          });
          //setFilter();
        }}
      >
        Criar
      </Button>
    </div>
  );
};
const TableRows = ({ row, setEditing, onDelete, setResult }) => {
  return (
    <TableRow
      key={row.name}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        {row.id}
      </TableCell>
      <TableCell align="right">{row.user.name}</TableCell>
      <TableCell align="right">{row.pet.name}</TableCell>
      <TableCell align="right">{row.date}</TableCell>
      <TableCell align="right">
        {row.data && (
          <img
            alt=""
            style={{ maxWidth: 80 }}
            src={`${API_BASE_URL}${row.data}`}
          />
        )}
      </TableCell>
      <TableCell align="right">
        <Button
          style={{ backgroundColor: "#80C197" }}
          variant="contained"
          onClick={() => {
            setResult(row);
            setEditing(true);
            console.log(row)
          }}
        >
          <EditIcon />
        </Button>
        <Button
          style={{ margin: 10, backgroundColor: "#80C197" }}
          variant="contained"
          onClick={() => onDelete(row.id)}
        >
          <DeleteIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};
const Results = ({ onRegister, onDelete, onUpdate, results, users, pets }) => {
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [emailFilter, setFilter] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState({
    userId: null,
    petId: null,
    date: dayjs().toJSON(),
    imageId: null,
  });

  const setImageId = (id) => setResult({ ...result, imageId: id });

  if (creating)
    return (
      <CreateResult
        users={users}
        setResult={setResult}
        result={result}
        pets={pets}
        setImageId={setImageId}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onRegister={onRegister}
        setCreating={setCreating}
      />
    );
  if (editing)
    return (
      <EditResult
        users={users}
        setResult={setResult}
        result={result}
        pets={pets}
        setImageId={setImageId}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        onUpdate={onUpdate}
        setEditing={setEditing}
      />
    );
  return (
    <div>
      {/*<Typography>Busque por email</Typography>
      <TextField onChange={(e) => setFilter(e.target.value)}></TextField>
      */}
      <Button onClick={() => setCreating(true)}>
        Enviar resultados das consultas para cliente
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Cliente</TableCell>
              <TableCell align="right">Pet</TableCell>
              <TableCell align="right">Data</TableCell>
              <TableCell align="right">Resultado</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!!results.length &&
              (emailFilter
                ? results.filter((e) => e.user.email === emailFilter)
                : results
              ).map((row) => (
                <TableRows
                  row={row}
                  onDelete={onDelete}
                  setEditing={setEditing}
                  setResult={setResult}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Results;
