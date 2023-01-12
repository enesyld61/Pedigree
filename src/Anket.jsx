import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
    if (temp.substr(0, 1) === "0") {
      temp = temp.substr(1);
      document.getElementById(`${id}`).value = temp;
    }
    if (temp === "") {
      temp = 0;
      document.getElementById(`${id}`).value = temp;
    }
    fonk(temp);
  };

  const submit = (cinsiyet) => {
    let tempData = [
      {
        key: 0,
        n: "",
        s: "F",
        vir: 1,
        a: [],
        color: "white",
        carry: false,
        cm: false,
      },
      {
        key: 1,
        n: "",
        s: "M",
        ux: 0,
        a: [],
        color: "white",
        carry: false,
        cm: false,
      },
      {
        key: 2,
        n: "",
        s: "F",
        vir: 3,
        a: [],
        color: "white",
        carry: false,
        cm: false,
      },
      {
        key: 3,
        n: "",
        s: "M",
        ux: 2,
        a: [],
        color: "white",
        carry: false,
        cm: false,
      },
      {
        key: 4,
        n: "",
        s: "M",
        m: 0,
        f: 1,
        ux: 5,
        cm: false,
        a: [],
        color: "white",
        carry: false,
      },
      {
        key: 5,
        n: "",
        s: "F",
        m: 2,
        f: 3,
        vir: 4,
        cm: false,
        a: [],
        color: "white",
        carry: false,
      },
      {
        key: 6,
        n: "Hasta",
        s: cinsiyet,
        m: 5,
        f: 4,
        a: [],
        color: "black",
        carry: false,
      },
    ];

    for (let i = 1; i <= halaSayisi; i++) {
      tempData.push({
        key: tempData.length,
        n: "",
        s: "F",
        m: 0,
        f: 1,
        a: [],
        color: "white",
        carry: false,
      });
    }
    for (let i = 1; i <= amcaSayisi; i++) {
      tempData.push({
        key: tempData.length,
        n: "",
        s: "M",
        m: 0,
        f: 1,
        a: [],
        color: "white",
        carry: false,
      });
    }

    for (let i = 1; i <= teyzeSayisi; i++) {
      tempData.push({
        key: tempData.length,
        n: "",
        s: "F",
        m: 2,
        f: 3,
        a: [],
        color: "white",
        carry: false,
      });
    }
    for (let i = 1; i <= dayiSayisi; i++) {
      tempData.push({
        key: tempData.length,
        n: "",
        s: "M",
        m: 2,
        f: 3,
        a: [],
        color: "white",
        carry: false,
      });
    }
    for (let i = 1; i <= kizKardesSayisi; i++) {
      tempData.push({
        key: tempData.length,
        n: "",
        s: "F",
        m: 5,
        f: 4,
        a: [],
        color: "white",
        carry: false,
      });
    }
    for (let i = 1; i <= eKardesSayisi; i++) {
      tempData.push({
        key: tempData.length,
        n: "",
        s: "M",
        m: 5,
        f: 4,
        a: [],
        color: "white",
        carry: false,
      });
    }

    setData(tempData);
  };

  useEffect(() => {
    document.getElementById("radioKadin").checked = true;
  }, []);

  const fileOnChange = () => {
    const input = document.getElementById("input");
    let fr = new FileReader();
    fr.readAsText(input.files[0]);
    fr.onload = () => {
      let tempData = JSON.parse(fr.result);
      setData(tempData);
      setGoTree(true);
    };
  };

  const [goTree, setGoTree] = useState(false);

  useEffect(() => {
    if (goTree) {
      document.getElementById("btnA").click();
    }
  }, [goTree]);

  return (
    <div className="anket">
      <Container>
        <h2 id="h2Hasta">Hastanın;</h2>
        <Row>
          <Col xs="6">
            <h3>Cinsiyeti:</h3>
          </Col>
          <Col xs="6" id="radioCol">
            <Form>
              <Form.Check
                inline
                className="radio"
                label="Kadın"
                name="group1"
                type="radio"
                id="radioKadin"
              />
              <Form.Check
                inline
                className="radio"
                label="Erkek"
                name="group1"
                type="radio"
                id="radioErkek"
              />
            </Form>
          </Col>
        </Row>
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
        <Button
          id="btnOlustur"
          variant="primary"
          onClick={() => {
            if (document.getElementById("radioKadin").checked) {
              submit("F");
            } else {
              submit("M");
            }
            setGoTree(true);
          }}
        >
          Oluştur
        </Button>
      </Container>

      <br />
      <br />
      <p>veya</p>
      <br />
      <Form.Group className="mb-3">
        <Form.Control
          type="file"
          id="input"
          onChange={() => {
            fileOnChange();
          }}
        />
      </Form.Group>
      <Link to="/tree" id="btnA" className="invisible"></Link>
    </div>
  );
};
export default Anket;
