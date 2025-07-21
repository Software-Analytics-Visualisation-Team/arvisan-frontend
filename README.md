# Architecture Visualization & Analysis (ARVISAN) frontend

This is the frontend for the architecture
visualizer and analysis tool ARViSAN.

## Table of Contents
- [ARViSAN repositories](#arvisan-repositories)
- [Getting Started](#getting-started)
- [Requirements](#requirements)
- [Features](#features)
    - [Basic Navigation](#basic-navigation)
        - [Selecting an Individual Node](#selecting-an-individual-node)
    - [Tabs](#tabs)
        - [Navigation Tab](#navigation-tab)
        - [Visualization Tab](#visualization-tab)
            - [Layer Depth](#layer-depth)
            - [Outgoing vs Incoming dependencies](#outgoing-vs-incoming-dependencies)
            - [Limiting dependency scope](#limiting-dependency-scope)
            - [Layout algorithm](#layout-algorithm)
        - [Analysis Tab](#analysis-tab)
            - [Colouring modes](#colouring-modes)
    - [Breadcrumbs](#breadcrumbs)
    - [Graph Colours](#graph-colours)
        - [Node colours](#node-colours)
        - [Edge colours](#edge-colours)
- [Installation for Development](#installation-for-development)

## ARViSAN repositories
ARViSAN is separated into two main and two additional repositories described below:
 - **ARViSAN frontend (this repository)**: Responsible for rendering the graph and showing the analyses to the end user.
- **[ARVISAN backend](https://github.com/Software-Analytics-Visualisation-Team/arvisan-backend)**: Contains various endpoints for processing and executing queries to the graph database. 
- **[ARVISAN dependency parser](https://github.com/Software-Analytics-Visualisation-Team/arvisan-dependency-parser)**: Extendable Python script to preprocess software dependencies and convert them in ARViSAN's input format. Can be used to create input for visualizing confromance between expected (allowed) dependencies and actual (implementation) dependencies.
- **[ARVISAN input parser](https://github.com/Software-Analytics-Visualisation-Team/arvisan-input-parser)**:  Script created to specifically parse *OutSystems* consumer-producer data with functional domain (Application group) data into a labeled property graph, readable by Cytoscape. This script was used in the proof-of-concept version of ARViSAN.


## Getting Started
ARViSAN can be run easily using Docker. To get started quickly:
1) Clone the frontend (this repository)
2) Clone the [backend repository](https://github.com/Software-Analytics-Visualisation-Team/arvisan-backend) in the same parent folder as the front-end repository.
3) Navigate to the `arvisan-backend` directory and execute the following command:
```sh
docker-compose up
```

This command will build and start the containers defined in the docker-compose.yml file. Once the containers are up and running, you can access the application on localhost:5173. After opening the visualization, use the credentials:test_user and test_password to log in.

When opening the tool for the first time, there will be no data. To seed the data click on the Seeder button, which will open the 'ARViSAN input parser' popup. Open the Import tab and upload the nodes and edges CSV files from the data folder. Afterwards, click on Submit. You will then see the welcome popup again and once the data has been loaded on the bottom you will see All_Subsystem_Group as an entry point to the visualization.
When you click Select you will see a graph containing all subsystem groups as nodes.

This stack contains the backend, frontend, and an empty Neo4j database instance.
The Neo4j database within the Docker stack can also be replaced by a local Neo4j instance (for example Neo4j Desktop).

## Requirements
- **ARVISAN backend**: A working instance of the backend (https://github.com/Software-Analytics-Visualisation-Team/arvisan-backend).
- **NodeJS 20**: Dependencies are installed with npm.

## Features
### Basic Navigation
You can click and drag the nodes to move them or click and drag the background to move the graph.

#### Selecting an Individual Node
Right-click on a node to refresh the graph and show only dependencies relevant to that node. This feature works with any type of node (e.g., parent/child node).
### Tabs
#### Navigation Tab
Use this tab to highlight a node currently rendered from the Show node in visualization, or any node saved in the tool's database, from the Find & select node from database. The History section shows previously selected nodes.

#### Visualization Tab
This tab contains options to modify the complexity of the rendered graph.

##### Layer Depth
Use the Layer depth slider to increase or decrease the layer depth. The highest depth is the highest for the graph unless a node is selected. In that case, the highest depth equals the depth of the selected node. Adjust the lowest depth to simplify or add more details to the graph.

##### Outgoing vs Incoming dependencies
Toggle the radio buttons labelled Query & show outgoing/incoming relationships to visualize outgoing and incoming dependencies.

##### Limiting dependency scope
To visualize local dependencies (all dependencies under a selected node), toggle off the show domain internal relationships radio button.

##### Layout algorithm
Use this dropdown to change the layout of the nodes. Currently, only three options are available. Klay (the default one) works best.

#### Analysis Tab
The analysis tab contains options to modify the node sizing and colouring. 

##### Colouring modes
Two modes are relevant for subsystem dependency visualization:

- **Interface Profile**: Changes the colors of component nodes to depict components that contain internal/external interfaces.
- **Deployment Profile**: Changes the colors of component nodes to depict the deployment platform used for that component.

### Breadcrumbs
The breadcrumbs on top of the graph depict the hierarchy from the top node of the graph to the currently selected node (e.g., All_Subsystem_Groups >> Subsystem Group 1 >> Subsystem A). The breadcrumbs reflect the layer depth currently rendered. They are also interactive and can be used to search for nodes in different layers.

### Graph Colours
By default, nodes and edges can have different colours.

#### Node colours
Nodes can be gray or orange. Orange nodes signify components that contain interfaces, but do not follow the Thermo Fisher naming convention of ending at (ITF or INT_ITF). For more information about component interfaces read `dependency-parser/README.md`

#### Edge colours
Edges can be black, orange, or red. 
- **Black edges**: allowed dependencies.
- **Red ones**: violations.
- **Orange edges**: dependencies to components of subsystems that have interface components, however, the dependency does not target those interface components.

## Installation for Development

- Install the ARVISAN backend.
- Install NodeJS 20.
- Install all dependencies: `npm install`.
- Start the application: `npm run dev`.
- The frontend can now be found at http://localhost:5173/.
Requests will automatically be proxied to a running backend instance
