import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import "./Anket.css";

export const Anket = ({ setData }) => {
  const [amcaSayisi, setAmcaSayisi] = useState(0);
  const [halaSayisi, setHalaSayisi] = useState(0);
  const [teyzeSayisi, setTeyzeSayisi] = useState(0);
  const [dayiSayisi, setDayiSayisi] = useState(0);
  const [eKardesSayisi, setErkekKardesSayisi] = useState(0);
  const [kizKardesSayisi, setKizKardesSayisi] = useState(0);

  const degisiklik = (e, fonk, id) => {
    let temp = e.target.value;
    if (temp === "") {
      temp = 0;
      document.getElementById(`${id}`).value = temp;
    }
    fonk(temp);
  };

  const submit = () => {
    let tempData = [
      { key: 0, n: "babane", s: "F", vir: 1 },
      { key: 1, n: "dede", s: "M", ux: 0 },
      { key: 2, n: "anane", s: "F", vir: 3 },
      { key: 3, n: "dede", s: "M", ux: 2 },
      { key: 4, n: "baba", s: "M", m: 0, f: 1, ux: 5 },
      { key: 5, n: "anne", s: "F", m: 2, f: 3, vir: 4 },
      { key: 6, n: "hasta", s: "F", m: 5, f: 4 },
    ];

    for (let i = 1; i <= halaSayisi; i++) {
      tempData.push({ key: tempData.length, n: "hala", s: "F", m: 0, f: 1 });
    }
    for (let i = 1; i <= amcaSayisi; i++) {
      tempData.push({ key: tempData.length, n: "amca", s: "M", m: 0, f: 1 });
    }

    for (let i = 1; i <= teyzeSayisi; i++) {
      tempData.push({ key: tempData.length, n: "teyze", s: "F", m: 2, f: 3 });
    }
    for (let i = 1; i <= dayiSayisi; i++) {
      tempData.push({ key: tempData.length, n: "dayı", s: "M", m: 2, f: 3 });
    }
    for (let i = 1; i <= kizKardesSayisi; i++) {
      tempData.push({
        key: tempData.length,
        n: "kız kardeş",
        s: "F",
        m: 5,
        f: 4,
      });
    }
    for (let i = 1; i <= eKardesSayisi; i++) {
      tempData.push({
        key: tempData.length,
        n: "erkek kardeş",
        s: "M",
        m: 5,
        f: 4,
      });
    }

    setData(tempData);
  };

  return (
    <div>
      <Container>
        <h2>Hastanın;</h2>
        <Row>
          <Col xs="6">
            <h3>Kız kardeş sayısı:</h3>
          </Col>
          <Col xs="6">
            <Form.Control
              onChange={(e) =>
                degisiklik(e, setKizKardesSayisi, "kizKardesForm")
              }
              id="kizKardesForm"
              className="formInput"
              type="number"
              min={0}
              defaultValue={0}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <h3>Erkek kardeş sayısı:</h3>
          </Col>
          <Col xs="6">
            <Form.Control
              onChange={(e) =>
                degisiklik(e, setErkekKardesSayisi, "erkekKardesForm")
              }
              id="erkekKardesForm"
              className="formInput"
              type="number"
              min={0}
              defaultValue={0}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <h3>Teyze sayısı:</h3>
          </Col>
          <Col xs="6">
            <Form.Control
              onChange={(e) => degisiklik(e, setTeyzeSayisi, "teyzeForm")}
              id="teyzeForm"
              className="formInput"
              type="number"
              min={0}
              defaultValue={0}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <h3>Dayı sayısı:</h3>
          </Col>
          <Col xs="6">
            <Form.Control
              onChange={(e) => degisiklik(e, setDayiSayisi, "dayiForm")}
              id="dayiForm"
              className="formInput"
              type="number"
              min={0}
              defaultValue={0}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <h3>Hala sayısı:</h3>
          </Col>
          <Col xs="6">
            <Form.Control
              onChange={(e) => degisiklik(e, setHalaSayisi, "halaForm")}
              id="halaForm"
              className="formInput"
              type="number"
              min={0}
              defaultValue={0}
            />
          </Col>
        </Row>
        <Row>
          <Col xs="6">
            <h3>Amca sayısı:</h3>
          </Col>
          <Col xs="6">
            <Form.Control
              onChange={(e) => degisiklik(e, setAmcaSayisi, "amcaForm")}
              id="amcaForm"
              className="formInput"
              type="number"
              min={0}
              defaultValue={0}
            />
          </Col>
        </Row>
      </Container>

      <Link to="/tree">
        <Button
          variant="primary"
          onClick={() => {
            submit();
          }}
        >
          Soy ağacını oluştur
        </Button>
      </Link>
    </div>
  );
};
export default Anket;
