/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import * as go from "gojs";
import "./Tree.css";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const Tree = ({ data, setData }) => {
  const [temp, setTemp] = useState([]);
  const [selected, setSelected] = useState([]);
  let myDiagram;
  useEffect(() => {
    updateTemp();
    init();
    document.title = "Pedigree Chart - Tree";
  }, []);

  function init() {
    var myDiagramDiv = document.getElementById("myDiagramDiv");
    var parentDiv = document.getElementById("sample");
    parentDiv.removeChild(myDiagramDiv);
    var div = document.createElement("div");
    div.setAttribute("id", "myDiagramDiv");
    parentDiv.appendChild(div);
    const $ = go.GraphObject.make;

    myDiagram = $(go.Diagram, "myDiagramDiv", {
      initialAutoScale: go.Diagram.Uniform,
      "undoManager.isEnabled": true,
      nodeSelectionAdornmentTemplate: $(
        go.Adornment,
        "Auto",
        { layerName: "Grid" },
        $(go.Shape, "Circle", { fill: "yellow", stroke: null }),
        $(go.Placeholder, { margin: 2 })
      ),
      layout: $(GenogramLayout, {
        direction: 90,
        layerSpacing: 30,
        columnSpacing: 10,
      }),
    });
    myDiagram.allowDelete = false;

    const change = () => {
      let arrSelect = [];
      for (let i = 0; i < data.length; i++) {
        if (myDiagram.findNodeForKey(data[i].key).isSelected) {
          arrSelect.push(data[i]);
        }
      }
      setSelected(arrSelect);
    };

    myDiagram.addDiagramListener("ChangedSelection", change);

    const attrFill = (a) => {
      switch (a) {
        case "A":
          return "#00af54"; // green
        case "B":
          return "#f27935"; // orange
        case "C":
          return "#d4071c"; // red
        case "D":
          return "#70bdc2"; // cyan
        case "E":
          return "#fcf384"; // gold
        case "F":
          return "#e69aaf"; // pink
        case "G":
          return "#08488f"; // blue
        case "H":
          return "#866310"; // brown
        case "I":
          return "#9270c2"; // purple
        case "J":
          return "#a3cf62"; // chartreuse
        case "K":
          return "#91a4c2"; // lightgray bluish
        case "L":
          return "#af70c2"; // magenta
        case "S":
          return "#d4071c"; // red
        default:
          return "transparent";
      }
    };

    // determine the geometry for each attribute shape in a male;
    // except for the slash these are all squares at each of the four corners of the overall square
    const tlsq = go.Geometry.parse("F M1 1 l19 0 0 19 -19 0z");
    const trsq = go.Geometry.parse("F M20 1 l19 0 0 19 -19 0z");
    const brsq = go.Geometry.parse("F M20 20 l19 0 0 19 -19 0z");
    const blsq = go.Geometry.parse("F M1 20 l19 0 0 19 -19 0z");
    const slash = go.Geometry.parse("F M38 0 L40 0 40 2 2 40 0 40 0 38z");
    function maleGeometry(a) {
      switch (a) {
        case "A":
          return tlsq;
        case "B":
          return tlsq;
        case "C":
          return tlsq;
        case "D":
          return trsq;
        case "E":
          return trsq;
        case "F":
          return trsq;
        case "G":
          return brsq;
        case "H":
          return brsq;
        case "I":
          return brsq;
        case "J":
          return blsq;
        case "K":
          return blsq;
        case "L":
          return blsq;
        case "S":
          return slash;
        default:
          return tlsq;
      }
    }

    // determine the geometry for each attribute shape in a female;
    // except for the slash these are all pie shapes at each of the four quadrants of the overall circle
    const tlarc = go.Geometry.parse("F M20 20 B 180 90 20 20 19 19 z");
    const trarc = go.Geometry.parse("F M20 20 B 270 90 20 20 19 19 z");
    const brarc = go.Geometry.parse("F M20 20 B 0 90 20 20 19 19 z");
    const blarc = go.Geometry.parse("F M20 20 B 90 90 20 20 19 19 z");
    function femaleGeometry(a) {
      switch (a) {
        case "A":
          return tlarc;
        case "B":
          return tlarc;
        case "C":
          return tlarc;
        case "D":
          return trarc;
        case "E":
          return trarc;
        case "F":
          return trarc;
        case "G":
          return brarc;
        case "H":
          return brarc;
        case "I":
          return brarc;
        case "J":
          return blarc;
        case "K":
          return blarc;
        case "L":
          return blarc;
        case "S":
          return slash;
        default:
          return tlarc;
      }
    }

    // two different node templates, one for each sex,
    // named by the category value in the node data object
    myDiagram.nodeTemplateMap.add(
      "M", // male
      $(
        go.Node,
        "Vertical",
        {
          locationSpot: go.Spot.Center,
          locationObjectName: "ICON",
          selectionObjectName: "ICON",
        },
        new go.Binding("opacity", "hide", (h) => (h ? 0 : 1)),
        new go.Binding("pickable", "hide", (h) => !h),

        $(
          go.Panel,
          { name: "ICON" },
          $(
            go.Shape,
            "Square",
            {
              width: 40,
              height: 40,
              strokeWidth: 2,
              fill: "white",
              stroke: "#000000",
              portId: "",
            },
            new go.Binding("fill", "color")
          ),
          $(
            go.Panel,
            {
              // for each attribute show a Shape at a particular place in the overall square
              itemTemplate: $(
                go.Panel,
                $(
                  go.Shape,
                  { stroke: null, strokeWidth: 0 },
                  new go.Binding("fill", "", attrFill),
                  new go.Binding("geometry", "", maleGeometry)
                )
              ),
              margin: 1,
            },
            new go.Binding("itemArray", "a")
          ),
          // support "carry" for nodes
          $(
            go.Shape,
            "Circle",
            {
              width: 8,
              height: 8,
              position: new go.Point(16.5, 16.5),
              visible: false,
            },
            new go.Binding("visible", "carry")
          )
        ),
        $(
          go.TextBlock,
          {
            font: "16px sans-serif",
            textAlign: "center",
            maxSize: new go.Size(80, NaN),
          },
          new go.Binding("text", "n")
        )
      )
    );

    myDiagram.nodeTemplateMap.add(
      "D", // düşük
      $(
        go.Node,
        "Vertical",
        {
          locationSpot: go.Spot.Center,
          locationObjectName: "ICON",
          selectionObjectName: "ICON",
        },
        new go.Binding("opacity", "hide", (h) => (h ? 0 : 1)),
        new go.Binding("pickable", "hide", (h) => !h),

        $(
          go.Panel,
          { name: "ICON" },
          $(
            go.Shape,
            "Circle",
            {
              width: 10,
              height: 10,
              strokeWidth: 2,
              fill: "black",
              stroke: "#000000",
              portId: "",
            },
            new go.Binding("fill", "black")
          ),
          $(
            go.Panel,
            {
              margin: 1,
            },
            new go.Binding("itemArray", "a")
          )
        ),
        $(
          go.TextBlock,
          {
            font: "16px sans-serif",
            textAlign: "center",
            maxSize: new go.Size(80, NaN),
          },
          new go.Binding("text", "n")
        )
      )
    );

    myDiagram.nodeTemplateMap.add(
      "F", // female
      $(
        go.Node,
        "Vertical",
        {
          locationSpot: go.Spot.Center,
          locationObjectName: "ICON",
          selectionObjectName: "ICON",
        },
        new go.Binding("opacity", "hide", (h) => (h ? 0 : 1)),
        new go.Binding("pickable", "hide", (h) => !h),
        $(
          go.Panel,
          { name: "ICON" },
          $(
            go.Shape,
            "Circle",
            {
              width: 40,
              height: 40,
              strokeWidth: 2,
              fill: "white",
              stroke: "#000000",
              portId: "",
            },
            new go.Binding("fill", "color")
          ),
          $(
            go.Panel,
            {
              // for each attribute show a Shape at a particular place in the overall circle
              itemTemplate: $(
                go.Panel,
                $(
                  go.Shape,
                  { stroke: null, strokeWidth: 0 },
                  new go.Binding("fill", "", attrFill),
                  new go.Binding("geometry", "", femaleGeometry)
                )
              ),
              margin: 1,
            },
            new go.Binding("itemArray", "a")
          ),
          // support "carry" for nodes
          $(
            go.Shape,
            "Circle",
            {
              width: 8,
              height: 8,
              position: new go.Point(16.5, 16.5),
              visible: false,
            },
            new go.Binding("visible", "carry")
          )
        ),
        $(
          go.TextBlock,
          {
            font: "16px sans-serif",
            textAlign: "center",
            maxSize: new go.Size(80, NaN),
          },
          new go.Binding("text", "n")
        )
      )
    );

    // the representation of each label node -- nothing shows on a Marriage Link
    myDiagram.nodeTemplateMap.add(
      "LinkLabel",
      $(go.Node, {
        selectable: false,
        width: 1,
        height: 1,
        fromEndSegmentLength: 20,
      })
    );

    myDiagram.linkTemplate = // for parent-child relationships
      $(
        ParentChildLink, // custom routing for same birth siblings
        {
          routing: go.Link.Orthogonal,
          curviness: 10,
          layerName: "Background",
          selectable: false,
          fromSpot: go.Spot.Bottom,
          toSpot: go.Spot.Top,
        },
        $(go.Shape, { strokeWidth: 2 })
      );
    /*
    myDiagram.linkTemplate = // for parent-child relationships
      $(
        go.Link,
        {
          routing: go.Link.Orthogonal,
          corner: 5,
          layerName: "Background",
          selectable: false,
        },
        $(go.Shape, { stroke: "#424242", strokeWidth: 2 })
      );
*/

    myDiagram.linkTemplateMap.add(
      "Marriage", // for marriage relationships
      $(
        go.Link,
        { selectable: false, layerName: "Background" },
        // support "cm" on Marriage links
        $(
          go.Shape,
          { isPanelMain: true, strokeWidth: 2.5, stroke: "#000000" },
          new go.Binding("strokeWidth", "cm", (cm) => (cm ? 7 : 2.5))
        ),
        $(
          go.Shape,
          {
            isPanelMain: true,
            strokeWidth: 2,
            stroke: "white",
            visible: false,
          },
          new go.Binding("visible", "cm")
        ),
        //boşanmış evlilik için
        $(
          go.Shape,
          "MinusLine",
          {
            width: 20,
            height: 20,
            position: new go.Point(16.5, 16.5),
            visible: false,
            angle: -60,
            scale: 2,
          },
          new go.Binding("visible", "bosanmis")
        )
      )
    );

    myDiagram.linkTemplateMap.add(
      "Identical", // for connecting twins/triplets
      $(
        go.Link,
        { selectable: false, isTreeLink: false, isLayoutPositioned: false },
        $(go.Shape, { strokeWidth: 2, stroke: "blue" })
      )
    );

    // n: name, s: sex, m: mother, f: father, ux: wife, vir: husband, a: attributes/markers
    setupDiagram(myDiagram, data);
  }

  // create and initialize the Diagram.model given an array of node data representing people
  function setupDiagram(diagram, array) {
    diagram.model = new go.GraphLinksModel({
      // declare support for link label nodes
      linkLabelKeysProperty: "labelKeys",
      // this property determines which template is used
      nodeCategoryProperty: "s",
      // if a node data object is copied, copy its data.a Array
      copiesArrays: true,
      // create all of the nodes for people
      nodeDataArray: array,
    });
    setupMarriages(diagram);
    setupParents(diagram);
    setupIdenticalTwins(diagram);
  }

  function findMarriage(diagram, a, b) {
    // A and B are node keys
    const nodeA = diagram.findNodeForKey(a);
    const nodeB = diagram.findNodeForKey(b);
    if (nodeA !== null && nodeB !== null) {
      const it = nodeA.findLinksBetween(nodeB); // in either direction
      while (it.next()) {
        const link = it.value;
        // Link.data.category === "Marriage" means it's a marriage relationship
        if (link.data !== null && link.data.category === "Marriage")
          return link;
      }
    }
    return null;
  }

  function setupIdenticalTwins(diagram) {
    const model = diagram.model;
    const nodeDataArray = model.nodeDataArray;
    for (let i = 0; i < nodeDataArray.length; i++) {
      const data1 = nodeDataArray[i];
      if (typeof data1.identical === "number") {
        const key1 = data1.key;
        const key2 = data1.identical;
        const data2 = model.findNodeDataForKey(key2);

        if (data2 !== null && data1.m === data2.m && data1.f === data2.f) {
          const T1 = diagram.findNodeForKey(key1);
          const T2 = diagram.findNodeForKey(key2);

          const TPL1 = T1.findTreeParentLink();
          const TPL2 = T2.findTreeParentLink();

          if (TPL1 && TPL2) {
            let TLN1 = TPL1.labelNodes.first();
            if (!TLN1) {
              TLN1 = new go.Node();
              TLN1.isLayoutPositioned = false;
              TLN1.labeledLink = TPL1;
              TLN1.segmentIndex = -2;
              TLN1.segmentFraction = 0.25;
              diagram.add(TLN1);
            }

            let TLN2 = TPL2.labelNodes.first();
            if (!TLN2) {
              TLN2 = new go.Node();
              TLN2.isLayoutPositioned = false;
              TLN2.labeledLink = TPL2;
              TLN2.segmentIndex = -2;
              TLN2.segmentFraction = 0.25;
              diagram.add(TLN2);
            }

            let TL = TLN1.findLinksBetween(TLN2).first();
            if (!TL) {
              const tlinktempl = diagram.linkTemplateMap.get("Identical");
              TL = tlinktempl.copy();
              TL.fromNode = TLN1;
              TL.toNode = TLN2;
              diagram.add(TL);
            }
          }
        }
      }
    }
  }

  // now process the node data to determine marriages
  function setupMarriages(diagram) {
    const model = diagram.model;
    const nodeDataArray = model.nodeDataArray;
    for (let i = 0; i < nodeDataArray.length; i++) {
      const data = nodeDataArray[i];
      const key = data.key;
      let uxs = data.ux;
      if (uxs !== undefined) {
        if (typeof uxs === "number") uxs = [uxs];
        for (let j = 0; j < uxs.length; j++) {
          const wife = uxs[j];
          const wdata = model.findNodeDataForKey(wife);
          if (key === wife || !wdata || wdata.s !== "F") {
            console.log(
              "cannot create Marriage relationship with self or unknown person " +
                wife
            );
            continue;
          }
          const link = findMarriage(diagram, key, wife);
          if (link === null) {
            // add a label node for the marriage link
            const mlab = { s: "LinkLabel" };
            model.addNodeData(mlab);
            // add the marriage link itself, also referring to the label node
            const mdata = {
              from: key,
              to: wife,
              labelKeys: [mlab.key],
              category: "Marriage",
            };
            if (data.cm || wdata.cm) mdata.cm = true; // copy cm to link data
            if (data.bosanmis || wdata.bosanmis) mdata.bosanmis = true;
            model.addLinkData(mdata);
          }
        }
      }
      let virs = data.vir;
      if (virs !== undefined) {
        if (typeof virs === "number") virs = [virs];
        for (let j = 0; j < virs.length; j++) {
          const husband = virs[j];
          const hdata = model.findNodeDataForKey(husband);
          if (key === husband || !hdata || hdata.s !== "M") {
            console.log(
              "cannot create Marriage relationship with self or unknown person " +
                husband
            );
            continue;
          }
          const link = findMarriage(diagram, key, husband);
          if (link === null) {
            // add a label node for the marriage link
            const mlab = { s: "LinkLabel" };
            model.addNodeData(mlab);
            // add the marriage link itself, also referring to the label node
            const mdata = {
              from: key,
              to: husband,
              labelKeys: [mlab.key],
              category: "Marriage",
            };
            if (data.cm || hdata.cm) mdata.cm = true;
            if (data.bosanmis || hdata.bosanmis) mdata.bosanmis = true;
            model.addLinkData(mdata);
          }
        }
      }
    }
  }

  // process parent-child relationships once all marriages are known
  function setupParents(diagram) {
    const model = diagram.model;
    const nodeDataArray = model.nodeDataArray;
    for (let i = 0; i < nodeDataArray.length; i++) {
      const data = nodeDataArray[i];
      const key = data.key;
      const mother = data.m;
      const father = data.f;
      if (mother !== undefined && father !== undefined) {
        const link = findMarriage(diagram, mother, father);
        if (link === null) {
          // or warn no known mother or no known father or no known marriage between them
          console.log("unknown marriage: " + mother + " & " + father);
          continue;
        }
        const mdata = link.data;
        if (mdata.labelKeys === undefined || mdata.labelKeys[0] === undefined)
          continue;
        const mlabkey = mdata.labelKeys[0];
        const cdata = { from: mlabkey, to: key };
        myDiagram.model.addLinkData(cdata);
      }
    }
  }
  // A custom layout that shows the two families related to a person's parents

  /*
  class GenogramLayout extends go.LayeredDigraphLayout {
    constructor() {
      super();
      this.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
      this.spouseSpacing = 30; // minimum space between spouses
    }

    makeNetwork(coll) {
      // generate LayoutEdges for each parent-child Link
      const net = this.createNetwork();
      if (coll instanceof go.Diagram) {
        this.add(net, coll.nodes, true);
        this.add(net, coll.links, true);
      } else if (coll instanceof go.Group) {
        this.add(net, coll.memberParts, false);
      } else if (coll.iterator) {
        this.add(net, coll.iterator, false);
      }
      return net;
    }

    // internal method for creating LayeredDigraphNetwork where husband/wife pairs are represented
    // by a single LayeredDigraphVertex corresponding to the label Node on the marriage Link
    add(net, coll, nonmemberonly) {
      const horiz = this.direction == 0.0 || this.direction == 180.0;
      const multiSpousePeople = new go.Set();
      // consider all Nodes in the given collection
      const it = coll.iterator;
      while (it.next()) {
        const node = it.value;
        if (!(node instanceof go.Node)) continue;
        if (!node.isLayoutPositioned || !node.isVisible()) continue;
        if (nonmemberonly && node.containingGroup !== null) continue;
        // if it's an unmarried Node, or if it's a Link Label Node, create a LayoutVertex for it
        if (node.isLinkLabel) {
          // get marriage Link
          const link = node.labeledLink;
          const spouseA = link.fromNode;
          const spouseB = link.toNode;
          // create vertex representing both husband and wife
          const vertex = net.addNode(node);
          // now define the vertex size to be big enough to hold both spouses
          if (horiz) {
            vertex.height =
              spouseA.actualBounds.height +
              this.spouseSpacing +
              spouseB.actualBounds.height;
            vertex.width = Math.max(
              spouseA.actualBounds.width,
              spouseB.actualBounds.width
            );
            vertex.focus = new go.Point(
              vertex.width / 2,
              spouseA.actualBounds.height + this.spouseSpacing / 2
            );
          } else {
            vertex.width =
              spouseA.actualBounds.width +
              this.spouseSpacing +
              spouseB.actualBounds.width;
            vertex.height = Math.max(
              spouseA.actualBounds.height,
              spouseB.actualBounds.height
            );
            vertex.focus = new go.Point(
              spouseA.actualBounds.width + this.spouseSpacing / 2,
              vertex.height / 2
            );
          }
        } else {
          // don't add a vertex for any married person!
          // instead, code above adds label node for marriage link
          // assume a marriage Link has a label Node
          let marriages = 0;
          node.linksConnected.each((l) => {
            if (l.isLabeledLink) marriages++;
          });
          if (marriages === 0) {
            net.addNode(node);
          } else if (marriages > 1) {
            multiSpousePeople.add(node);
          }
        }
      }
      // now do all Links
      it.reset();
      while (it.next()) {
        const link = it.value;
        if (!(link instanceof go.Link)) continue;
        if (!link.isLayoutPositioned || !link.isVisible()) continue;
        if (nonmemberonly && link.containingGroup !== null) continue;
        // if it's a parent-child link, add a LayoutEdge for it
        if (!link.isLabeledLink) {
          const parent = net.findVertex(link.fromNode); // should be a label node
          const child = net.findVertex(link.toNode);
          if (child !== null) {
            // an unmarried child
            net.linkVertexes(parent, child, link);
          } else {
            // a married child
            link.toNode.linksConnected.each((l) => {
              if (!l.isLabeledLink) return; // if it has no label node, it's a parent-child link
              // found the Marriage Link, now get its label Node
              const mlab = l.labelNodes.first();
              // parent-child link should connect with the label node,
              // so the LayoutEdge should connect with the LayoutVertex representing the label node
              const mlabvert = net.findVertex(mlab);
              if (mlabvert !== null) {
                net.linkVertexes(parent, mlabvert, link);
              }
            });
          }
        }
      }

      while (multiSpousePeople.count > 0) {
        // find all collections of people that are indirectly married to each other
        const node = multiSpousePeople.first();
        const cohort = new go.Set();
        this.extendCohort(cohort, node);
        // then encourage them all to be the same generation by connecting them all with a common vertex
        const dummyvert = net.createVertex();
        net.addVertex(dummyvert);
        const marriages = new go.Set();
        cohort.each((n) => {
          n.linksConnected.each((l) => {
            marriages.add(l);
          });
        });
        marriages.each((link) => {
          // find the vertex for the marriage link (i.e. for the label node)
          const mlab = link.labelNodes.first();
          const v = net.findVertex(mlab);
          if (v !== null) {
            net.linkVertexes(dummyvert, v, null);
          }
        });
        // done with these people, now see if there are any other multiple-married people
        multiSpousePeople.removeAll(cohort);
      }
    }

    // collect all of the people indirectly married with a person
    extendCohort(coll, node) {
      if (coll.has(node)) return;
      coll.add(node);
      node.linksConnected.each((l) => {
        if (l.isLabeledLink) {
          // if it's a marriage link, continue with both spouses
          this.extendCohort(coll, l.fromNode);
          this.extendCohort(coll, l.toNode);
        }
      });
    }

    assignLayers() {
      super.assignLayers();
      const horiz = this.direction == 0.0 || this.direction == 180.0;
      // for every vertex, record the maximum vertex width or height for the vertex's layer
      const maxsizes = [];
      this.network.vertexes.each((v) => {
        const lay = v.layer;
        let max = maxsizes[lay];
        if (max === undefined) max = 0;
        const sz = horiz ? v.width : v.height;
        if (sz > max) maxsizes[lay] = sz;
      });
      // now make sure every vertex has the maximum width or height according to which layer it is in,
      // and aligned on the left (if horizontal) or the top (if vertical)
      this.network.vertexes.each((v) => {
        const lay = v.layer;
        const max = maxsizes[lay];
        if (horiz) {
          v.focus = new go.Point(0, v.height / 2);
          v.width = max;
        } else {
          v.focus = new go.Point(v.width / 2, 0);
          v.height = max;
        }
      });
      // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
      // (other than the ones that are the widest or tallest in their respective layer).
    }

    commitNodes() {
      super.commitNodes();
      const horiz = this.direction == 0.0 || this.direction == 180.0;
      // position the spouses of each marriage vertex
      this.network.vertexes.each((v) => {
        if (v.node === null) return;
        if (!v.node.isLinkLabel) return;
        const labnode = v.node;
        const lablink = labnode.labeledLink;
        // In case the spouses are not actually moved, we need to have the marriage link
        // position the label node, because LayoutVertex.commit() was called above on these vertexes.
        // Alternatively we could override LayoutVetex.commit to be a no-op for label node vertexes.
        lablink.invalidateRoute();
        let spouseA = lablink.fromNode;
        let spouseB = lablink.toNode;
        if (spouseA.opacity > 0 && spouseB.opacity > 0) {
          // prefer fathers on the left, mothers on the right
          if (spouseA.data.s === "F") {
            // sex is female
            const temp = spouseA;
            spouseA = spouseB;
            spouseB = temp;
          }
          // see if the parents are on the desired sides, to avoid a link crossing
          const aParentsNode = this.findParentsMarriageLabelNode(spouseA);
          const bParentsNode = this.findParentsMarriageLabelNode(spouseB);
          if (
            aParentsNode !== null &&
            bParentsNode !== null &&
            (horiz
              ? aParentsNode.position.x > bParentsNode.position.x
              : aParentsNode.position.y > bParentsNode.position.y)
          ) {
            // swap the spouses
            const temp = spouseA;
            spouseA = spouseB;
            spouseB = temp;
          }
          spouseA.moveTo(v.x, v.y);
          if (horiz) {
            spouseB.moveTo(
              v.x,
              v.y + spouseA.actualBounds.height + this.spouseSpacing
            );
          } else {
            spouseB.moveTo(
              v.x + spouseA.actualBounds.width + this.spouseSpacing,
              v.y
            );
          }
        } else if (spouseA.opacity === 0) {
          const pos = horiz
            ? new go.Point(v.x, v.centerY - spouseB.actualBounds.height / 2)
            : new go.Point(v.centerX - spouseB.actualBounds.width / 2, v.y);
          spouseB.move(pos);
          if (horiz) pos.y++;
          else pos.x++;
          spouseA.move(pos);
        } else if (spouseB.opacity === 0) {
          const pos = horiz
            ? new go.Point(v.x, v.centerY - spouseA.actualBounds.height / 2)
            : new go.Point(v.centerX - spouseA.actualBounds.width / 2, v.y);
          spouseA.move(pos);
          if (horiz) pos.y++;
          else pos.x++;
          spouseB.move(pos);
        }
        lablink.ensureBounds();
      });
      // position only-child nodes to be under the marriage label node
      this.network.vertexes.each((v) => {
        if (v.node === null || v.node.linksConnected.count > 1) return;
        const mnode = this.findParentsMarriageLabelNode(v.node);
        if (mnode !== null && mnode.linksConnected.count === 1) {
          // if only one child
          const mvert = this.network.findVertex(mnode);
          const newbnds = v.node.actualBounds.copy();
          if (horiz) {
            newbnds.y = mvert.centerY - v.node.actualBounds.height / 2;
          } else {
            newbnds.x = mvert.centerX - v.node.actualBounds.width / 2;
          }
          // see if there's any empty space at the horizontal mid-point in that layer
          const overlaps = this.diagram.findObjectsIn(
            newbnds,
            (x) => x.part,
            (p) => p !== v.node,
            true
          );
          if (overlaps.count === 0) {
            v.node.move(newbnds.position);
          }
        }
      });
    }

    findParentsMarriageLabelNode(node) {
      const it = node.findNodesInto();
      while (it.next()) {
        const n = it.value;
        if (n.isLinkLabel) return n;
      }
      return null;
    }
  }
  // end GenogramLayout class
  */

  function GenogramLayout() {
    go.LayeredDigraphLayout.call(this);
    this.initializeOption = go.LayeredDigraphLayout.InitDepthFirstIn;
  }
  go.Diagram.inherit(GenogramLayout, go.LayeredDigraphLayout);

  GenogramLayout.prototype.makeNetwork = function (coll) {
    // generate LayoutEdges for each parent-child Link
    let net = this.createNetwork();
    if (coll instanceof go.Diagram) {
      this.add(net, coll.nodes, true);
      this.add(net, coll.links, true);
    } else if (coll instanceof go.Group) {
      this.add(net, coll.memberParts, false);
    } else if (coll.iterator) {
      this.add(net, coll.iterator, false);
    }
    return net;
  };

  // internal method for creating LayeredDigraphNetwork where husband/wife pairs are represented
  // by a single LayeredDigraphVertex corresponding to the label Node on the marriage Link
  GenogramLayout.prototype.add = function (net, coll, nonmemberonly) {
    // consider all Nodes in the given collection
    let it = coll.iterator;
    while (it.next()) {
      let node = it.value;
      if (!(node instanceof go.Node)) continue;
      if (!node.isLayoutPositioned || !node.isVisible()) continue;
      if (nonmemberonly && node.containingGroup !== null) continue;
      // if it's an unmarried Node, or if it's a Link Label Node, create a LayoutVertex for it
      if (node.isLinkLabel) {
        // get marriage Link
        let link = node.labeledLink;
        let spouseA = link.fromNode;
        let spouseB = link.toNode;
        // create vertex representing both husband and wife
        var vertex = net.addNode(node);
        // now define the vertex size to be big enough to hold both spouses
        vertex.width =
          spouseA.actualBounds.width + 30 + spouseB.actualBounds.width;
        vertex.height = Math.max(
          spouseA.actualBounds.height,
          spouseB.actualBounds.height
        );
        vertex.focus = new go.Point(
          spouseA.actualBounds.width + 30 / 2,
          vertex.height / 2
        );
      } else {
        // don't add a vertex for any married person!
        // instead, code above adds label node for marriage link
        // assume a marriage Link has a label Node
        if (
          !node.linksConnected.any(function (l) {
            return l.category === "Marriage";
          })
        ) {
          vertex = net.addNode(node);
        }
      }
    }
    // now do all Links
    it.reset();
    while (it.next()) {
      let link = it.value;
      if (!(link instanceof go.Link)) continue;
      if (!link.isLayoutPositioned || !link.isVisible()) continue;
      if (nonmemberonly && link.containingGroup !== null) continue;
      // if it's a parent-child link, add a LayoutEdge for it
      if (link.category !== "Marriage") {
        let parent = net.findVertex(link.fromNode); // should be a label node
        let child = net.findVertex(link.toNode);
        if (child !== null) {
          // an unmarried child
          net.linkVertexes(parent, child, link);
        } else {
          // a married child
          link.toNode.linksConnected.each(function (l) {
            if (l.category !== "Marriage") return; // if it has no label node, it's a parent-child link
            // found the Marriage Link, now get its label Node
            let mlab = l.labelNodes.first();
            // parent-child link should connect with the label node,
            // so the LayoutEdge should connect with the LayoutVertex representing the label node
            let mlabvert = net.findVertex(mlab);
            if (mlabvert !== null) {
              net.linkVertexes(parent, mlabvert, link);
            }
          });
        }
      }
    }
  };

  GenogramLayout.prototype.assignLayers = function () {
    go.LayeredDigraphLayout.prototype.assignLayers.call(this);
    let horiz = this.direction == 0.0 || this.direction == 180.0;
    // for every vertex, record the maximum vertex width or height for the vertex's layer
    let maxsizes = [];
    this.network.vertexes.each(function (v) {
      let lay = v.layer;
      let max = maxsizes[lay];
      if (max === undefined) max = 0;
      let sz = horiz ? v.width : v.height;
      if (sz > max) maxsizes[lay] = sz;
    });
    // now make sure every vertex has the maximum width or height according to which layer it is in,
    // and aligned on the left (if horizontal) or the top (if vertical)
    this.network.vertexes.each(function (v) {
      let lay = v.layer;
      let max = maxsizes[lay];
      if (horiz) {
        v.focus = new go.Point(0, v.height / 2);
        v.width = max;
      } else {
        v.focus = new go.Point(v.width / 2, 0);
        v.height = max;
      }
    });
    // from now on, the LayeredDigraphLayout will think that the Node is bigger than it really is
    // (other than the ones that are the widest or tallest in their respective layer).
  };

  GenogramLayout.prototype.commitNodes = function () {
    go.LayeredDigraphLayout.prototype.commitNodes.call(this);
    // position regular nodes
    this.network.vertexes.each(function (v) {
      if (v.node !== null && !v.node.isLinkLabel) {
        v.node.position = new go.Point(v.x, v.y);
      }
    });
    // position the spouses of each marriage vertex
    let layout = this;
    this.network.vertexes.each(function (v) {
      if (v.node === null) return;
      if (!v.node.isLinkLabel) return;
      let labnode = v.node;
      let lablink = labnode.labeledLink;
      // In case the spouses are not actually moved, we need to have the marriage link
      // position the label node, because LayoutVertex.commit() was called above on these vertexes.
      // Alternatively we could override LayoutVetex.commit to be a no-op for label node vertexes.
      lablink.invalidateRoute();
      let spouseA = lablink.fromNode;
      let spouseB = lablink.toNode;
      // prefer fathers on the left, mothers on the right
      if (spouseA.data.s === "F") {
        // sex is female
        let temp = spouseA;
        spouseA = spouseB;
        spouseB = temp;
      }
      // see if the parents are on the desired sides, to avoid a link crossing
      let aParentsNode = layout.findParentsMarriageLabelNode(spouseA);
      let bParentsNode = layout.findParentsMarriageLabelNode(spouseB);
      if (
        aParentsNode !== null &&
        bParentsNode !== null &&
        aParentsNode.position.x > bParentsNode.position.x
      ) {
        // swap the spouses
        let temp = spouseA;
        spouseA = spouseB;
        spouseB = temp;
      }
      spouseA.position = new go.Point(v.x, v.y);
      spouseB.position = new go.Point(
        v.x + spouseA.actualBounds.width + 30,
        v.y
      );
      if (spouseA.opacity === 0) {
        let pos = new go.Point(v.centerX - spouseA.actualBounds.width / 2, v.y);
        spouseA.position = pos;
        spouseB.position = pos;
      } else if (spouseB.opacity === 0) {
        let pos = new go.Point(v.centerX - spouseB.actualBounds.width / 2, v.y);
        spouseA.position = pos;
        spouseB.position = pos;
      }
    });
  };

  GenogramLayout.prototype.findParentsMarriageLabelNode = function (node) {
    let it = node.findNodesInto();
    while (it.next()) {
      let n = it.value;
      if (n.isLinkLabel) return n;
    }
    return null;
  };

  // end GenogramLayout class

  // custom routing for same birth siblings
  function ParentChildLink() {
    go.Link.call(this);
  }
  go.Diagram.inherit(ParentChildLink, go.Link);

  ParentChildLink.prototype.computePoints = function () {
    let result = go.Link.prototype.computePoints.call(this);
    let pts = this.points;
    if (pts.length >= 4) {
      let birthId = this.toNode.data["birth"];
      if (birthId) {
        let parents = this.fromNode;
        let sameBirth = 0;
        let sumX = 0;
        let it = parents.findNodesOutOf();
        while (it.next()) {
          let child = it.value;
          if (child.data["birth"] === birthId) {
            sameBirth++;
            sumX += child.location.x;
          }
        }
        if (sameBirth > 0) {
          let midX = sumX / sameBirth;
          let midY = pts.elt(0).y + 57; //??? adjust to suit your node sizes and layer spacing
          pts.setElt(pts.length - 4, new go.Point(pts.elt(0).x, midY));
          pts.setElt(pts.length - 3, new go.Point(midX, midY));
          pts.setElt(pts.length - 2, pts.elt(pts.length - 1));
        }
      }
    }
    return result;
  };
  // end ParentChildLink class

  useEffect(() => {
    setData(temp);
  }, [temp]);

  const updateTemp = (newObject = {}) => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    if (newObject.hasOwnProperty("n")) {
      tempData.push(newObject);
    }
    setTemp(tempData);
  };

  useEffect(() => {
    init();
  }, [data]);

  useEffect(() => {
    const formDiv = document.getElementById("formDiv");
    const btnAddEvlilik = document.getElementById("btnAddEvlilik");
    const btnAddEbeveyn = document.getElementById("btnAddEbeveyn");
    const btnAddErkekCocuk = document.getElementById("btnAddErkekCocuk");
    const btnAddKizCocuk = document.getElementById("btnAddKizCocuk");
    const btnAddErkek = document.getElementById("btnAddErkek");
    const btnAddKiz = document.getElementById("btnAddKiz");
    const def = document.getElementById("def");
    const txt = document.getElementById("txt");
    const checkOlu = document.getElementById("checkOlu");
    const checkHasta = document.getElementById("checkHasta");
    const checkTasiyici = document.getElementById("checkTasiyici");
    const divAkraba = document.getElementById("divAkraba");
    const checkAkraba = document.getElementById("checkAkraba");
    //const btnMonozigot = document.getElementById("btnMonozigot");
    //const btnDizigot = document.getElementById("btnDizigot");
    const btnIkizSil = document.getElementById("btnIkizSil");
    const colCheck = document.getElementById("colCheck");
    const colBtns = document.getElementById("colBtns");
    const btnSil = document.getElementById("btnSil");

    // kimse seçili değilse
    if (selected.length === 0) {
      formDiv.classList.add("invisible");
      btnSil.disabled = true;
    } else {
      btnSil.disabled = false;
      let dusuk = false;
      for (let i = 0; i < selected.length; i++) {
        if (selected[i].s === "D") {
          dusuk = true;
        }
      }
      if (dusuk) {
        colCheck.classList.add("invisible");
        colBtns.classList.add("invisible");
        txt.value = selected[0].n;
        if (selected.length === 1) {
          formDiv.classList.remove("invisible");
        } else {
          formDiv.classList.add("invisible");
        }
      }
      // 1 seçili kişi için
      else if (selected.length === 1) {
        colCheck.classList.remove("invisible");
        colBtns.classList.remove("invisible");
        //btnMonozigot.disabled = true;
        //btnDizigot.disabled = true;
        if (selected[0].hasOwnProperty("birth")) {
          btnIkizSil.disabled = false;
        } else {
          btnIkizSil.disabled = true;
        }
        formDiv.classList.remove("invisible");
        btnAddEvlilik.disabled = true;
        def.classList.remove("invisible");
        txt.classList.remove("invisible");
        txt.value = selected[0].n;
        if (selected[0].color === "black") {
          checkHasta.checked = true;
        } else {
          checkHasta.checked = false;
        }
        checkTasiyici.checked = selected[0].carry;
        if (selected[0].a.includes("S")) {
          checkOlu.checked = true;
        } else {
          checkOlu.checked = false;
        }
        if (
          selected[0].hasOwnProperty("vir") ||
          selected[0].hasOwnProperty("ux")
        ) {
          divAkraba.classList.remove("invisible");
          btnAddErkekCocuk.disabled = false;
          btnAddKizCocuk.disabled = false;
          if (selected[0].hasOwnProperty("cm") && selected[0].cm) {
            checkAkraba.checked = true;
          } else {
            checkAkraba.checked = false;
          }
        } else {
          divAkraba.classList.add("invisible");
          btnAddErkekCocuk.disabled = true;
          btnAddKizCocuk.disabled = true;
        }
        if (selected[0].hasOwnProperty("m")) {
          btnAddEbeveyn.disabled = true;
          btnAddErkek.disabled = false;
          btnAddKiz.disabled = false;
        } else {
          btnAddEbeveyn.disabled = false;
          btnAddErkek.disabled = true;
          btnAddKiz.disabled = true;
        }
      }
      // 2 seçili kişi için
      else if (selected.length === 2) {
        colCheck.classList.remove("invisible");
        colBtns.classList.remove("invisible");
        formDiv.classList.remove("invisible");
        def.classList.add("invisible");
        txt.classList.add("invisible");
        checkHasta.checked = false;
        checkTasiyici.checked = false;
        checkOlu.checked = false;

        //evliyseler
        if (
          selected[0].hasOwnProperty("vir") ||
          selected[0].hasOwnProperty("ux")
        ) {
          btnAddEvlilik.disabled = true;

          //birbirleriyle evliyseler
          if (
            (selected[0].hasOwnProperty("vir") &&
              selected[0].vir === selected[1].key) ||
            (selected[0].hasOwnProperty("ux") &&
              selected[0].ux === selected[1].key)
          ) {
            divAkraba.classList.remove("invisible");
            if (selected[0].hasOwnProperty("cm") && selected[0].cm) {
              checkAkraba.checked = true;
            } else {
              checkAkraba.checked = false;
            }
            btnAddErkekCocuk.disabled = false;
            btnAddKizCocuk.disabled = false;
            btnAddEbeveyn.disabled = true;
            btnAddErkek.disabled = true;
            btnAddKiz.disabled = true;
          }
          //başkasıyla evliyseler
          else {
            btnAddErkekCocuk.disabled = true;
            btnAddKizCocuk.disabled = true;
            if (
              selected[0].hasOwnProperty("m") ||
              selected[1].hasOwnProperty("m")
            ) {
              btnAddEbeveyn.disabled = true;
            } else {
              btnAddEbeveyn.disabled = false;
            }
            if (
              selected[0].hasOwnProperty("m") &&
              selected[1].hasOwnProperty("m") &&
              selected[0].m === selected[1].m
            ) {
              btnAddErkek.disabled = false;
              btnAddKiz.disabled = false;
            } else {
              btnAddErkek.disabled = true;
              btnAddKiz.disabled = true;
            }
          }
        }
        //evli değilseler
        else {
          btnAddErkekCocuk.disabled = true;
          btnAddKizCocuk.disabled = true;
          if (
            selected[0].hasOwnProperty("m") ||
            selected[1].hasOwnProperty("m")
          ) {
            btnAddEbeveyn.disabled = true;
          } else {
            btnAddEbeveyn.disabled = false;
          }
          if (
            (selected[0].hasOwnProperty("m") &&
              selected[1].hasOwnProperty("m") &&
              selected[0].m === selected[1].m) ||
            selected[0].s === selected[1].s
          ) {
            btnAddEvlilik.disabled = true;
          } else {
            btnAddEvlilik.disabled = false;
          }
          if (
            selected[0].hasOwnProperty("m") &&
            selected[1].hasOwnProperty("m") &&
            selected[0].m === selected[1].m
          ) {
            btnAddErkek.disabled = false;
            btnAddKiz.disabled = false;
          } else {
            btnAddErkek.disabled = true;
            btnAddKiz.disabled = true;
          }
        }
      }

      // 2'den fazla seçili kişi için
      else {
        colCheck.classList.remove("invisible");
        colBtns.classList.remove("invisible");
        formDiv.classList.remove("invisible");
        def.classList.add("invisible");
        txt.classList.add("invisible");
        checkHasta.checked = false;
        checkTasiyici.checked = false;
        checkOlu.checked = false;
        divAkraba.classList.add("invisible");
        btnAddEvlilik.disabled = true;
        btnAddErkekCocuk.disabled = true;
        btnAddKizCocuk.disabled = true;
        let hasM = 0;
        let ms = [];
        for (let i = 0; i < selected.length; i++) {
          if (selected[i].hasOwnProperty("m")) {
            hasM++;
            ms.push(selected[i].m);
          }
        }
        if (hasM === 0) {
          let married = false;
          for (let i = 0; i < selected.length; i++) {
            for (let j = i + 1; j < selected.length; j++) {
              if (
                (selected[i].hasOwnProperty("vir") &&
                  selected[i].vir === selected[j].key) ||
                (selected[i].hasOwnProperty("ux") &&
                  selected[i].ux === selected[j].key)
              ) {
                married = true;
              }
            }
          }

          if (married === false) {
            btnAddEbeveyn.disabled = false;
          } else {
            btnAddEbeveyn.disabled = true;
          }
        } else {
          btnAddEbeveyn.disabled = true;
          let same = true;
          for (let i = 1; i < ms.length; i++) {
            if (ms[0] !== ms[i]) {
              same = false;
            }
          }
          if (same && ms.length === selected.length) {
            btnAddErkek.disabled = false;
            btnAddKiz.disabled = false;
          } else {
            btnAddErkek.disabled = true;
            btnAddKiz.disabled = true;
          }
        }
      }
    }
  }, [selected]);

  const addDusukCocuk = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    let mother, father;
    if (selected[0].s == "F") {
      mother = selected[0].key;
      father = selected[0].vir;
    } else {
      mother = selected[0].ux;
      father = selected[0].key;
    }
    let tempObj = {
      key: tempData[tempData.length - 1].key + 1,
      n: "",
      s: "D",
      m: mother,
      f: father,
    };
    tempData.push(tempObj);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const addErkekKardes = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    let tempObj = {
      key: tempData[tempData.length - 1].key + 1,
      n: "",
      s: "M",
      m: selected[0].m,
      f: selected[0].f,
      a: [],
      color: "white",
    };
    tempData.push(tempObj);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const addKizKardes = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    let tempObj = {
      key: tempData[tempData.length - 1].key + 1,
      n: "",
      s: "F",
      m: selected[0].m,
      f: selected[0].f,
      a: [],
      color: "white",
    };
    tempData.push(tempObj);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const addEbeveyn = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    let tempObjM, tempObjF;
    if (selected.length === 2) {
      tempObjM = {
        key: tempData[tempData.length - 1].key + 1,
        n: "",
        s: "M",
        ux: tempData[tempData.length - 1].key + 2,
        a: [],
        color: "white",
        carry: false,
        cm: false,
      };
      tempObjF = {
        key: tempData[tempData.length - 1].key + 2,
        n: "",
        s: "F",
        vir: tempData[tempData.length - 1].key + 1,
        a: [],
        color: "white",
        carry: false,
        cm: false,
      };
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].key == selected[0].key) {
          tempData[i].f = tempObjM.key;
          tempData[i].m = tempObjF.key;
        } else if (tempData[i].key == selected[1].key) {
          tempData[i].f = tempObjM.key;
          tempData[i].m = tempObjF.key;
        }
      }
    } else {
      tempObjM = {
        key: tempData[tempData.length - 1].key + 1,
        n: "",
        s: "M",
        ux: tempData[tempData.length - 1].key + 2,
        a: [],
        color: "white",
        carry: false,
        cm: false,
      };
      tempObjF = {
        key: tempData[tempData.length - 1].key + 2,
        n: "",
        s: "F",
        vir: tempData[tempData.length - 1].key + 1,
        a: [],
        color: "white",
        carry: false,
        cm: false,
      };
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].key == selected[0].key) {
          tempData[i].f = tempObjM.key;
          tempData[i].m = tempObjF.key;
        }
      }
    }
    tempData.push(tempObjM);
    tempData.push(tempObjF);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const addErkekCocuk = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    let mother, father;
    if (selected[0].s == "F") {
      mother = selected[0].key;
      father = selected[0].vir;
    } else {
      mother = selected[0].ux;
      father = selected[0].key;
    }
    let tempObj = {
      key: tempData[tempData.length - 1].key + 1,
      n: "",
      s: "M",
      m: mother,
      f: father,
      a: [],
      color: "white",
    };
    tempData.push(tempObj);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const addKizCocuk = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    let mother, father;
    if (selected[0].s == "F") {
      mother = selected[0].key;
      father = selected[0].vir;
    } else {
      mother = selected[0].ux;
      father = selected[0].key;
    }
    let tempObj = {
      key: tempData[tempData.length - 1].key + 1,
      n: "",
      s: "F",
      m: mother,
      f: father,
      a: [],
      color: "white",
    };
    tempData.push(tempObj);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const addEvlilik = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    if (selected[0].s == "F") {
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].key == selected[0].key) {
          tempData[i].vir = selected[1].key;
        } else if (tempData[i].key == selected[1].key) {
          tempData[i].ux = selected[0].key;
        }
      }
    } else {
      for (let i = 0; i < tempData.length; i++) {
        if (tempData[i].key == selected[0].key) {
          tempData[i].ux = selected[1].key;
        } else if (tempData[i].key == selected[1].key) {
          tempData[i].vir = selected[0].key;
        }
      }
    }
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const addYeniKisiKadin = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    let tempObj = {
      key: tempData[tempData.length - 1].key + 1,
      n: "",
      s: "F",
      a: [],
      color: "white",
    };
    tempData.push(tempObj);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const addYeniKisiErkek = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    let tempObj = {
      key: tempData[tempData.length - 1].key + 1,
      n: "",
      s: "M",
      a: [],
      color: "white",
    };
    tempData.push(tempObj);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const personalSave = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }

    const txt = document.getElementById("txt");
    const checkOlu = document.getElementById("checkOlu");
    const checkHasta = document.getElementById("checkHasta");
    const checkTasiyici = document.getElementById("checkTasiyici");
    const checkAkraba = document.getElementById("checkAkraba");

    if (selected.length === 1) {
      let index = tempData.indexOf(selected[0]);
      tempData[index].n = txt.value;
      if (selected[0].s !== "D") {
        if (checkOlu.checked) {
          tempData[index].a = ["S"];
        } else {
          tempData[index].a = [];
        }
        if (checkHasta.checked) {
          tempData[index].color = "black";
        } else {
          tempData[index].color = "white";
        }
        if (checkTasiyici.checked) {
          tempData[index].carry = true;
        } else {
          tempData[index].carry = false;
        }
        if (
          selected[0].hasOwnProperty("vir") ||
          selected[0].hasOwnProperty("ux")
        ) {
          let index2;
          for (let i = 0; i < tempData.length; i++) {
            if (
              (selected[0].hasOwnProperty("vir") &&
                tempData[i].key === selected[0].vir) ||
              (selected[0].hasOwnProperty("ux") &&
                tempData[i].key === selected[0].ux)
            ) {
              index2 = i;
            }
          }
          if (checkAkraba.checked) {
            tempData[index].cm = true;
            tempData[index2].cm = true;
          } else {
            tempData[index].cm = false;
            tempData[index2].cm = false;
          }
        }
      } else {
        let indexes = [];
        for (let i = 0; i < selected.length; i++) {
          indexes.push(tempData.indexOf(selected[i]));
        }
        if (checkOlu.checked) {
          for (let i = 0; i < indexes.length; i++) {
            tempData[indexes[i]].a = "S";
          }
        } else {
          for (let i = 0; i < indexes.length; i++) {
            tempData[indexes[i]].a = [];
          }
        }
        if (checkHasta.checked) {
          for (let i = 0; i < indexes.length; i++) {
            tempData[indexes[i]].color = "black";
          }
        } else {
          for (let i = 0; i < indexes.length; i++) {
            tempData[indexes[i]].color = "white";
          }
        }
        if (checkTasiyici.checked) {
          for (let i = 0; i < indexes.length; i++) {
            tempData[indexes[i]].carry = true;
          }
        } else {
          for (let i = 0; i < indexes.length; i++) {
            tempData[indexes[i]].carry = false;
          }
        }
        if (
          (selected.length == 2 &&
            selected[0].hasOwnProperty("vir") &&
            selected[0].vir === selected[1].key) ||
          (selected[0].hasOwnProperty("ux") &&
            selected[0].ux === selected[1].key)
        ) {
          if (checkAkraba.checked) {
            tempData[indexes[0]].cm = true;
            tempData[indexes[1]].cm = true;
          } else {
            tempData[indexes[0]].cm = false;
            tempData[indexes[1]].cm = false;
          }
        }
      }
    }

    setSelected([]);
    setTemp(tempData);
  };

  const downloadData = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
        delete tempData[tempData.length - 1].__gohashid;
      }
    }
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(tempData)
    )}`;

    const link = document.createElement("a");
    link.href = jsonString;
    if (document.getElementById("dosyaAdi").value !== "") {
      link.download = `${document.getElementById("dosyaAdi").value}.json`;
    } else {
      link.download = `data.json`;
    }
    link.click();
    updateTemp(temp);
    setSelected([]);
    document.getElementById("formDiv").classList.add("invisible");
  };

  const downloadPdf = () => {
    html2canvas(document.getElementById("myDiagramDiv")).then((canvas) => {
      let base64image = canvas.toDataURL("image/png");
      let pdf = new jsPDF("p", "px", [1600, 1131]);
      pdf.addImage(base64image, "PNG", 15, 15, 1110, 360);
      if (document.getElementById("pdfAdi").value == "") {
        pdf.save("data.pdf");
      } else {
        pdf.save(`${document.getElementById("pdfAdi").value}.pdf`);
      }
    });
  };

  const kisiyiSil = () => {
    let tempData = [];

    if (selected.length === 1) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].hasOwnProperty("n")) {
          if (data[i].key !== selected[0].key) {
            tempData.push(data[i]);
          }
        }
      }
      if (selected[0].s == "F") {
        for (let i = 0; i < tempData.length; i++) {
          if (
            tempData[i].hasOwnProperty("m") &&
            tempData[i].m == selected[0].key
          ) {
            delete tempData[i].m;
            delete tempData[i].f;
          }
          if (
            tempData[i].hasOwnProperty("ux") &&
            tempData[i].ux == selected[0].key
          ) {
            delete tempData[i].ux;
            delete tempData[i].cm;
          }
        }
      } else {
        for (let i = 0; i < tempData.length; i++) {
          if (
            tempData[i].hasOwnProperty("f") &&
            tempData[i].f == selected[0].key
          ) {
            delete tempData[i].f;
            delete tempData[i].m;
          }
          if (
            tempData[i].hasOwnProperty("vir") &&
            tempData[i].vir == selected[0].key
          ) {
            delete tempData[i].vir;
            delete tempData[i].cm;
          }
        }
      }
    } else {
      for (let i = 0; i < data.length; i++) {
        if (data[i].hasOwnProperty("n")) {
          let same = false;
          for (let j = 0; j < selected.length; j++) {
            if (data[i].key === selected[j].key) {
              same = true;
            }
          }
          if (!same) {
            tempData.push(data[i]);
          }
        }
      }
      for (let j = 0; j < selected.length; j++) {
        if (selected[j].s == "F") {
          for (let i = 0; i < tempData.length; i++) {
            if (
              tempData[i].hasOwnProperty("m") &&
              tempData[i].m == selected[j].key
            ) {
              delete tempData[i].m;
              delete tempData[i].f;
            }
            if (
              tempData[i].hasOwnProperty("ux") &&
              tempData[i].ux == selected[j].key
            ) {
              delete tempData[i].ux;
              delete tempData[i].cm;
            }
          }
        } else {
          for (let i = 0; i < tempData.length; i++) {
            if (
              tempData[i].hasOwnProperty("f") &&
              tempData[i].f == selected[j].key
            ) {
              delete tempData[i].f;
              delete tempData[i].m;
            }
            if (
              tempData[i].hasOwnProperty("vir") &&
              tempData[i].vir == selected[j].key
            ) {
              delete tempData[i].vir;
              delete tempData[i].cm;
            }
          }
        }
      }
    }

    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const click = () => {
    console.log(temp);
  };

  const ikizSil = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    delete tempData[tempData.indexOf(selected[0])].birth;
    delete tempData[tempData.indexOf(selected[0])].identical;
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const monozigot = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    for (let i = 0; i < selected.length; i++) {
      tempData[tempData.indexOf(selected[i])].birth = births + 1;
      if (i !== 0) {
        tempData[tempData.indexOf(selected[i])].identical = selected[i - 1].key;
      }
    }
    setBirths((prev) => prev + 1);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const dizigot = () => {
    let tempData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].hasOwnProperty("n")) {
        tempData.push(data[i]);
      }
    }
    for (let i = 0; i < selected.length; i++) {
      tempData[tempData.indexOf(selected[i])].birth = births + 1;
    }
    setBirths((prev) => prev + 1);
    setTemp(tempData);
    document.getElementById("formDiv").classList.add("invisible");
    setSelected([]);
  };

  const [births, setBirths] = useState(0);

  return (
    <div id="allSampleContent" className="p-4 w-full">
      <Row>
        <Col xs="4" id="colAnaMenu">
          <Link to="/">
            <Button variant="primary">Ana Menü</Button>
          </Link>
        </Col>
        <Col xs="4" id="colYenile">
          <Button
            variant="primary"
            onClick={() => {
              updateTemp(temp);
              setSelected([]);
              document.getElementById("formDiv").classList.add("invisible");
            }}
          >
            Yenile
          </Button>
          <Button onClick={click}>Button</Button>
        </Col>
        <Col xs="2">
          <InputGroup className="mb-3" id="inputPdf">
            <Form.Control placeholder="Pdf adı" id="pdfAdi" />
            <Button
              onClick={downloadPdf}
              variant="outline-secondary"
              id="button-addon2"
            >
              Pdf indir
            </Button>
          </InputGroup>
        </Col>
        <Col xs="2">
          <InputGroup className="mb-3" id="inputKaydet">
            <Form.Control placeholder="Dosya adı" id="dosyaAdi" />
            <Button
              onClick={downloadData}
              variant="outline-secondary"
              id="button-addon2"
            >
              Veri kaydet
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <Row id="disDiv">
        <Col xs="8" id="sample">
          <div id="myDiagramDiv"></div>
        </Col>
        <Col xs="4" id="btnsDiv">
          <Row>
            <Col xs="6">
              <Button
                className="addBtn"
                variant="primary"
                onClick={() => {
                  addYeniKisiKadin();
                }}
              >
                Yeni kişi ekle (Kadın)
              </Button>
            </Col>
            <Col xs="6">
              <Button
                className="addBtn"
                variant="primary"
                onClick={() => {
                  addYeniKisiErkek();
                }}
              >
                Yeni kişi ekle (Erkek)
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                id="btnSil"
                className="addBtn"
                variant="danger"
                onClick={() => {
                  kisiyiSil();
                }}
              >
                Kişiyi sil
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <div id="formDiv" className="invisible">
        <Row>
          <Col xs="4" id="colCheck">
            <Row>
              <div>
                <Form.Check label="Hasta" type="checkbox" id="checkHasta" />
              </div>
              <div>
                <Form.Check
                  label="Taşıyıcı"
                  type="checkbox"
                  id="checkTasiyici"
                />
              </div>
              <div>
                <Form.Check label="Ölü" type="checkbox" id="checkOlu" />
              </div>
              <div id="divAkraba">
                <Form.Check
                  id="checkAkraba"
                  label="Akraba evliliği"
                  type="checkbox"
                />
              </div>
            </Row>
          </Col>
          <Col xs="4" id="colDefinition" className="colDef">
            <Form.Label id="def" htmlFor="txt">
              Açıklama
            </Form.Label>
            <Form.Control id="txt" as="textarea" rows={3} />
            <Button id="btnSave" variant="primary" onClick={personalSave}>
              Kaydet
            </Button>
          </Col>

          <Col xs="4" id="colBtns">
            <Row>
              <Col xs="6">
                <Button
                  id="btnAddKiz"
                  className="addBtn"
                  variant="primary"
                  onClick={() => {
                    addKizKardes();
                  }}
                >
                  Kız kardeş ekle
                </Button>
              </Col>
              <Col xs="6">
                <Button
                  id="btnAddErkek"
                  className="addBtn"
                  variant="primary"
                  onClick={() => {
                    addErkekKardes();
                  }}
                >
                  Erkek kardeş ekle
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs="4">
                <Button
                  id="btnAddKizCocuk"
                  className="addBtn"
                  variant="primary"
                  onClick={() => {
                    addKizCocuk();
                  }}
                >
                  Kız çocuk ekle
                </Button>
              </Col>
              <Col xs="4">
                <Button
                  id="btnAddErkekCocuk"
                  className="addBtn"
                  variant="primary"
                  onClick={() => {
                    addErkekCocuk();
                  }}
                >
                  Erkek çocuk ekle
                </Button>
              </Col>
              <Col xs="4">
                <Button
                  id="btnAddDusukCocuk"
                  className="addBtn"
                  variant="primary"
                  onClick={() => {
                    addDusukCocuk();
                  }}
                >
                  Düşük çocuk ekle
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs="6">
                <Button
                  id="btnAddEbeveyn"
                  className="addBtn"
                  variant="primary"
                  onClick={() => {
                    addEbeveyn();
                  }}
                >
                  Ebeveyn ekle
                </Button>
              </Col>
              <Col xs="6">
                <Button
                  id="btnAddEvlilik"
                  className="addBtn"
                  variant="primary"
                  onClick={() => {
                    addEvlilik();
                  }}
                >
                  Evlilik ekle
                </Button>
              </Col>
            </Row>
            <Row>
              <Col xs="6">
                <Button
                  id="btnMonozigot"
                  className="addBtn"
                  variant="primary"
                  onClick={monozigot}
                >
                  Monozigot ikiz
                </Button>
              </Col>
              <Col xs="6">
                <Button
                  id="btnDizigot"
                  className="addBtn"
                  variant="primary"
                  onClick={dizigot}
                >
                  Dizigot ikiz
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  id="btnIkizSil"
                  className="addBtn"
                  variant="danger"
                  onClick={ikizSil}
                >
                  İkiz sil
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default Tree;
