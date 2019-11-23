"use strict";

//https://stackoverflow.com/a/8776048
for (var ii=1e4, lookupTable=[]; ii--;) {
    lookupTable.push(Math.random()*101|0);
}
function lookup() {
    return ++ii >= lookupTable.length ? lookupTable[ii=0] : lookupTable[ii];
}

window.onload = function() {



    let loader = new PIXI.Loader();
    loader.add('resources/img/tileset.png')
        .add('resources/img/tileset-borderless.png')
        .add('resources/img/roads_rivers-tileset.png')
        .load(drawMap);
};

function drawMap() {

    let settings = getDefaultSettings();
    updateSettingsModal(settings);

    let canvas = document.getElementById("canvas");
    let app = new PIXI.Application({ width: settings.screenW, height: settings.screenH, transparent: false, preserveDrawingBuffer:true, view: canvas });

    const viewport = initializeViewport(app, settings);

    loadGrid(app, viewport, settings);

    $("#gridSettingsModal").submit(function() {
        viewport.destroy({children: true});
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });

    $("#elevationModal").submit(function() {
        viewport.destroy({children: true});
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });

    $("#moistureModal").submit(function() {
        viewport.destroy({children: true});
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });

    $("#mapHashModal").submit(function() {
        viewport.destroy({children: true});
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });

    $("#redraw").click(function() {
        viewport.destroy({children: true});
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });

    $("#reset").click(function() {

        settings = getDefaultSettings();
        updateSettingsModal(settings);

        viewport.destroy({children: true});
        for (let i = app.stage.children.length - 1; i >= 0; i--) {
            app.stage.removeChild(app.stage.children[i]);
        }
        applySettings(app);
        return false;
    });

    window.onresize = function() {
        let width = ( window.innerWidth - 100 > 1140 ) ? 1140 : window.innerWidth - 100;
        let height = window.innerHeight - 100;
        app.renderer.resize(width, height);
    };
};

function getDefaultSettings() {

    let width = ( window.innerWidth - 100 > 1140 ) ? 1140 : window.innerWidth - 100;
    let height = window.innerHeight - 100;
    let colums = ( Math.ceil( width / 24 ) > 47) ? 47 : Math.ceil( width / 24 );
    let rows = ( Math.ceil( height / ( 16 * 1.73205 ) ) > 20) ? 20 : Math.ceil( height / ( 16 * 1.73205 ) );

    return {
        screenW: width,
        screenH: height,
        hexSize: 16,
        hexOrientation: 'flat',
        hexColums: colums, // x
        hexRows:  rows, // y
        lineThickness: 1,
        lineColor: 0x999999,
        hideCoords: true,
        hideGrid: false,
        contourInterval_0: 0.2,
        contourInterval_1: 0.3,
        contourInterval_2: 0.5,
        contourInterval_3: 0.7,
        contourInterval_4: 0.9,
        // Elevation Noise
        elevationSeed: 'fdc9a9ca516c78d1f830948badf1875d88424406',
        setElevationSeed: false,
        frequencyElevation: 0.8,
        redistributionElevation: 1.0,
        elevationOctaves_0: 1,
        elevationOctaves_1: 0.5,
        elevationOctaves_2: 0.25,
        elevationOctaves_3: 0.12,
        createIsland: false,
        // Moisture Noise
        moistureSeed: 'd049b358d128cb265740a90fce37904ce07cd653',
        setMoistureSeed: false,
        drawMoisture: true,
        frequencyMoisture: 0.8,
        redistributionMoisture: 1.0,
        moistureOctaves_0: 1,
        moistureOctaves_1: 0.5,
        moistureOctaves_2: 0.25,
        moistureOctaves_3: 0.12
    }
}

function updateSettingsModal(settings) {
    // Grid
    $('#hexColums').val(settings.hexColums);
    $('#hexRows').val(settings.hexRows);
    $('#hideCoords').prop('checked', settings.hideCoords);
    $('#hideGrid').prop('checked', settings.hideGrid);
    $('#contourInterval_0').val(settings.contourInterval_0);
    $('#contourInterval_1').val(settings.contourInterval_1);
    $('#contourInterval_2').val(settings.contourInterval_2);
    $('#contourInterval_3').val(settings.contourInterval_3);
    $('#contourInterval_4').val(settings.contourInterval_4);
    // Elevation Noise
    $('#elevationSeed').val(settings.elevationSeed);
    $('#setElevationSeed').prop('checked', settings.setElevationSeed);
    $('#frequencyElevation').val(settings.frequencyElevation);
    $('#redistributionElevation').val(settings.redistributionElevation);
    $('#elevationOctaves_0').val(settings.elevationOctaves_0);
    $('#elevationOctaves_1').val(settings.elevationOctaves_1);
    $('#elevationOctaves_2').val(settings.elevationOctaves_2);
    $('#elevationOctaves_3').val(settings.elevationOctaves_3);
    $('#createIsland').prop('checked', settings.createIsland);
    // Moisture Noise
    $('#moistureSeed').val(settings.moistureSeed);
    $('#setMoistureSeed').prop('checked', settings.setMoistureSeed);
    $('#drawMoisture').prop('checked', settings.drawMoisture);
    $('#frequencyMoisture').val(settings.frequencyMoisture);
    $('#redistributionMoisture').val(settings.redistributionMoisture);
    $('#moistureOctaves_0').val(settings.moistureOctaves_0);
    $('#moistureOctaves_1').val(settings.moistureOctaves_1);
    $('#moistureOctaves_2').val(settings.moistureOctaves_2);
    $('#moistureOctaves_3').val(settings.moistureOctaves_3);
    // Map Hash
    $('#setMapHash').prop('checked', false);
    $('#mapHash').val(btoa(JSON.stringify(settings)));
}

function initializeViewport(app, settings) {

    let worldWidth = settings.hexColums * (settings.hexSize + (settings.hexSize / 2)) + (settings.hexSize / 2);
    let worldHeight = settings.hexRows * (settings.hexSize * 1.73205) + (settings.hexSize * 1.73205 / 2);
    if (settings.hexOrientation === 'pointy') {
        worldWidth = settings.hexColums * (settings.hexSize * 1.73205) + (settings.hexSize * 1.73205 / 2);
        worldHeight = settings.hexRows * (settings.hexSize + (settings.hexSize / 2)) + (settings.hexSize / 2);
    }

    const viewport = new Viewport.Viewport({
        screenWidth: app.view.offsetWidth,
        screenHeight: app.view.offsetHeight,
        worldWidth: worldWidth,
        worldHeight: worldHeight,

        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    app.stage.addChild(viewport);

    viewport
        .drag()
        .wheel()
        .bounce();

    return viewport;
}

function loadGrid(app, viewport, settings) {
    if (!$('#setMapHash').is(":checked")) $('#mapHash').val(btoa(JSON.stringify(settings)));
    //let Hex = Honeycomb.extendHex({ size: settings.hexSize,  orientation: settings.hexOrientation });
    let Hex = Honeycomb.extendHex({ size: {width: 32, height: 28},  orientation: settings.hexOrientation });
    let Grid = Honeycomb.defineGrid(Hex);
    let elevation = heightMap(settings);
    let moisture = moistureMap(settings);

    let biomeTileset = {
        "DeepWater": {x:4, y:5},
        "ShallowWater": {x:0, y:5},
        "FlatDesert1": {x:1, y:2},
        "FlatDesert2": {x:1, y:1},
        "FlatGrass": {x:2, y:0},
        "FlatSparseTrees1": {x:3, y:0},
        "FlatSparseTrees2": {x:4, y:0},
        "FlatForest": {x:5, y:0},
        "FlatForestSwampy": {x:7, y:1},
        "HillDesert": {x:9, y:2},
        "HillGrass": {x:7, y:0},
        "HillForest": {x:6, y:0},
        "HillForestNeedleleaf": {x:10, y:0},
        "MountainDesert": {x:8, y:2},
        "MountainShrubland1": {x:8, y:0},
        "MountainShrubland2": {x:9, y:0},
        "MountainAlpine1": {x:10, y:0},
        "MountainAlpine2": {x:11, y:0},
        "MountainImpassable1": {x:10, y:6},
        "MountainImpassable2": {x:0, y:6},
        "lake1": {x:12, y:0},
        "lake2": {x:3, y:1},
        "lake3": {x:2, y:1},
        "lake4": {x:8, y:1},
        "Volcano": {x:3, y:6},
        "lair": {x:0, y:8},
        "lairSnow": {x:1, y:8},
        "lairDesert": {x:2, y:8},
    };


    let riverTileset = {
        "SOURCE": {x:0, y:2},
        "SWNE": {x:1, y:2},
        "NWSE": {x:2, y:2},
        "SWNW": {x:3, y:2},
        "SENE": {x:5, y:2},
        "SWSE": {x:6, y:2},
        "NWNE": {x:7, y:2},
    };

    // render hex grid
    let gr = Grid.rectangle({ width: settings.hexColums, height: settings.hexRows });
    gr.forEach(hex => {
        let coords = hex.cartesian();
        hex.elevation = elevation[coords.x][coords.y];
        hex.moisture = moisture[coords.x][coords.y];
        if (hex.elevation < settings.contourInterval_0) {
            hex.archetype = "Deep Water";
            hex.biome = "Water";
            hex.tile = "DeepWater";
        }
        else if (hex.elevation < settings.contourInterval_1) {
            hex.archetype = "Shallow Water";
            hex.biome = "Water";
            hex.tile = "ShallowWater";
        }
        else if (hex.elevation < settings.contourInterval_2) {
            hex.archetype = "Flat";
            if (hex.moisture < 0.10) {
                hex.biome = "Desert";
                hex.tile = "FlatDesert1";
            } else if (hex.moisture < 0.25) {
                hex.biome = "Desert";
                hex.tile = "FlatDesert2";
            } else if (hex.moisture < 0.40) {
                hex.biome = "Grass";
                hex.tile = "FlatGrass";
            } else if (hex.moisture < 0.65) {
                hex.biome = "Grass";
                hex.tile = lookup() <= 10 ? "FlatSparseTrees2": "FlatSparseTrees1";
            } else if (hex.moisture < 0.95){
                hex.biome = "Forest";
                hex.tile = "FlatForest";
            } else {
                hex.biome = "Forest";
                hex.tile = "FlatForestSwampy";
            }
        }
        else if (hex.elevation < settings.contourInterval_3) {
            hex.archetype = "Hill";
            if (hex.moisture < 0.10) {
                hex.biome = "Desert";
                hex.tile = "HillDesert";
            }
            else if (hex.moisture < 0.45) {
                hex.biome = "Grass";
                hex.tile = "HillGrass";
            }
            else {
                hex.biome = "Forest";
                hex.tile = "HillForest";
            }
        }
        else if (hex.elevation < settings.contourInterval_4) {
            hex.archetype = "Mountain";
            if (hex.moisture < 0.10) {
                hex.biome = "Desert";
                hex.tile = "MountainDesert";
            }
            else if (hex.moisture < 0.30) {
                hex.biome = "Shrubland";
                hex.tile = lookup() <= 50 ? "MountainShrubland2": "MountainShrubland1";
            }
            else if (hex.moisture < 0.80) {
                hex.biome = "Alpine forest";
                hex.tile = lookup() <= 50 ? "MountainAlpine2": "MountainAlpine1";
            }
            else {
                hex.biome = "Shrubland";
                hex.tile = lookup() <= 50 ? "MountainShrubland2": "MountainShrubland1";
            }
        }
        else {
            hex.archetype = "Mountain impassable";
            hex.biome = "Snow";
            if (hex.moisture < 0.40) {
                hex.tile = lookup() <= 3 ? "Volcano": "MountainImpassable1";
            } else {
                hex.tile = "MountainImpassable2";
            }
        }
    });

    gr.forEach(hex => {
        if (hex.tile === "ShallowWater") {
            let hexesInRange = gr.neighborsOf(hex);
            let terrainSorrounded = true;
            let counter = 0;
            for (let i = 0; i < hexesInRange.length; i++) {
                let hexToCheck = hexesInRange[i];
                if (hexToCheck === undefined || hexToCheck.tile === 'DeepWater') {
                    terrainSorrounded = false;
                    break;
                } else if (hexToCheck !== undefined && hexToCheck.tile === 'ShallowWater') {
                    counter++;
                }
            }
            if (terrainSorrounded && counter < 2 ) {
                if (counter === 0) hex.tile = lookup() <= 50 ? "lake2": "lake1";
                else if (counter === 1) hex.tile = lookup() <= 50 ? "lake4": "lake3";
            }
        }

    });

    let texture = PIXI.utils.TextureCache['resources/img/tileset.png'];
    if (settings.hideGrid) texture = PIXI.utils.TextureCache['resources/img/tileset-borderless.png'];
    texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    for (let y = 0; y < settings.hexRows; y++) {
        for (let x = 0; x < settings.hexColums; x = x+2) {
            let hex = gr.get([x,y]);
            let tileCoords = biomeTileset[hex.tile];
            if (!tileCoords) continue;

            texture.frame = new PIXI.Rectangle(tileCoords.x*32, tileCoords.y*48, 32, 48);
            let fantasyHexTile = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture, texture.frame));
            fantasyHexTile.x = x * 24;
            fantasyHexTile.y = -18 + (y * 28);
            viewport.addChild(fantasyHexTile);

            // Lair
            if (hex.biome !== 'water' && (hex.biome === 'Forest' || hex.archetype === 'hill' || hex.biome === 'Snow' || hex.archetype === "Mountain")) {
                if (lookup() <= 3) {
                    hex.lair = "lair";
                    if (hex.biome === 'Desert') hex.lair = "lairDesert";
                    if (hex.tile === 'MountainImpassable2') hex.lair = "lairSnow";
                    tileCoords = biomeTileset[hex.lair];
                    if (!tileCoords) continue;
                    texture.frame = new PIXI.Rectangle(tileCoords.x*32, tileCoords.y*48, 32, 48);
                    let lairHexTile = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture, texture.frame));
                    lairHexTile.x = x * 24;
                    lairHexTile.y = -18 + (y * 28);
                    viewport.addChild(lairHexTile);
                }
            }
        }
        for (let x = 1; x < settings.hexColums; x=x+2) {
            let hex = gr.get([x,y]);
            let tileCoords = biomeTileset[hex.tile];
            if (!tileCoords) continue;
            texture.frame = new PIXI.Rectangle(tileCoords.x*32, tileCoords.y*48, 32, 48);
            let fantasyHexTile = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture, texture.frame));
            fantasyHexTile.x = x * 24;
            fantasyHexTile.y = -4 + (y * 28);
            viewport.addChild(fantasyHexTile);

            // Lair
            if (hex.biome !== 'water' && (hex.biome === 'Forest' || hex.biome === 'Snow' || hex.archetype === "Mountain")) {
                if (lookup() <= 3) {
                    hex.lair = "lair";
                    if (hex.biome === 'Desert') hex.lair = "lairDesert";
                    if (hex.tile === 'MountainImpassable2') hex.lair = "lairSnow";
                    tileCoords = biomeTileset[hex.lair];
                    if (!tileCoords) continue;
                    texture.frame = new PIXI.Rectangle(tileCoords.x*32, tileCoords.y*48, 32, 48);
                    let lairHexTile = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture, texture.frame));
                    lairHexTile.x = x * 24;
                    lairHexTile.y = -4 + (y * 28);
                    viewport.addChild(lairHexTile);
                }
            }
        }
    }

    let textureRivers = PIXI.utils.TextureCache['resources/img/roads_rivers-tileset.png'];
    textureRivers.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // River sources
    let riverSources = [];
    gr.forEach(hex => {
        if (hex.biome === "Water" || hex.tile === "Volcano" || hex.archetype === "Flat") return;
        if (hex.moisture < 0.70 && hex.archetype !== "Mountain impassable" && hex.biome !== 'Alpine forest') return;

        hex.source = false;
        if (hex.archetype === "Hill" && lookup() <= 6) {
            hex.source = true;
        } else if (hex.archetype === "Mountain" && lookup() <= 10) {
            hex.source = true;
        } else if (hex.archetype === "Mountain impassable" && hex.moisture < 0.40 && lookup() <= 15) { // Mountain impassable
            hex.source = true;
        } else if (hex.archetype === "Mountain impassable" && hex.moisture >= 0.40 && lookup() <= 34) { // Mountain impassable
            hex.source = true;
        }
        if (!hex.source) return;

        let hexesInRange = gr.neighborsOf(hex);
        for (let i = 0; i < hexesInRange.length; i++) {
            let hexToCheck = hexesInRange[i];
            if (!hexToCheck || hexToCheck.biome === "Water" || hexToCheck.source === true) {
                hex.source = false;
                break;
            }
        }
        if (hex.source) riverSources.push(hex);
    });

    riverSources.forEach(hex => {
        hex.river = "SOURCE";
        let tileCoords = riverTileset[hex.river];
        if (!tileCoords) return;
        textureRivers.frame = new PIXI.Rectangle(tileCoords.x*32, tileCoords.y*48, 32, 48);
        let riverSource = new PIXI.Sprite(new PIXI.Texture(textureRivers.baseTexture, textureRivers.frame));
        if (hex.x%2 === 1) {
            riverSource.x = hex.x * 24;
            riverSource.y = -4 + (hex.y * 28);
        } else {
            riverSource.x = hex.x * 24;
            riverSource.y = -18 + (hex.y * 28);
        }
        viewport.addChild(riverSource);

        // Elegir vecinos más humedos y que estén en el mismo archetipo o inferior y que no sea del mismo source.
        // al elegir source hay que crear un identificador, y meterlo en todos lo hex del rio para que no se haga un lazo


    });

    function onClick (event) {
        const hexCoordinates = Grid.pointToHex(event.world.x, event.world.y);
        if (!gr.get(hexCoordinates)) return;

        $('#hColumn').val(hexCoordinates.x);
        $('#hRow').val(hexCoordinates.y);
        $('#xCoord').val(event.world.x.toFixed(2));
        $('#yCoord').val(event.world.y.toFixed(2));

        let hex = gr.get(hexCoordinates);
        $('#hElevation').val(hex.elevation.toFixed(3));
        $('#hMoisture').val(hex.moisture.toFixed(3));
        $('#hTerrain').val(hex.archetype);
        $('#hBiome').val(hex.biome);
        $("#terrainColor").text(hex.terrainColor);
        $("#terrainColor").css('color', 'white');
        $("#terrainColorRow").css('background-color', hex.terrainColor);
        if ($('#drawMoisture').is(":checked")) {
            $("#biomeColor").text(hex.biomeColor);
            $("#biomeColor").css('color', 'white');
            $("#biomeColorRow").css('background-color', hex.biomeColor);
        }

        $('#hexInfoModal').modal('show');
    }

    viewport.on('clicked', onClick);


    if (settings.hideCoords === true) return;

    gr.forEach(hex => {
        const point = hex.toPoint();
        const centerPosition = hex.center().add(point);
        const coordinates = hex.coordinates();

        let fontSize = 12;
        if (settings.hexSize < 15) fontSize = settings.hexSize / 1.5;

        let text = new PIXI.Text(coordinates.x + ','+ coordinates.y,{fontFamily : 'Arial', fontSize: fontSize, fill : 0x000000, align : 'center'});

        text.x = centerPosition.x;
        text.y = centerPosition.y;
        text.anchor.set(0.5);

        viewport.addChild(text);
    });

}

function applySettings(app, viewport) {

    let width = ( window.innerWidth - 100 > 1140 ) ? 1140 : window.innerWidth - 100;
    let height = window.innerHeight - 100;

    let settings = {};
    if ($('#setMapHash').is(":checked")) {
        settings = JSON.parse(atob($('#mapHash').val()));
    } else {
        // Grid
        settings.hexSize = 16;
        settings.hexOrientation = 'flat';
        settings.lineThickness = 1;
        settings.screenW = width;
        settings.screenH = height - 100;
        settings.hexColums = parseInt($('#hexColums').val()) || (width - 100) / 54;
        settings.hexRows = parseInt($('#hexRows').val()) || (height - 100) / 72;
        settings.lineColor = 0x999999;
        settings.hideCoords = $('#hideCoords').is(":checked");
        settings.hideGrid = $('#hideGrid').is(":checked");
        settings.contourInterval_0 = parseFloat($('#contourInterval_0').val()) || 0.2;
        settings.contourInterval_1 = parseFloat($('#contourInterval_1').val()) || 0.3;
        settings.contourInterval_2 = parseFloat($('#contourInterval_2').val()) || 0.5;
        settings.contourInterval_3 = parseFloat($('#contourInterval_3').val()) || 0.7;
        settings.contourInterval_4 = parseFloat($('#contourInterval_4').val()) || 0.9;
        //Elevation Noise
        settings.setElevationSeed = $('#setElevationSeed').is(":checked");
        if (settings.setElevationSeed) {
            settings.elevationSeed = $('#elevationSeed').val();
        } else {
            settings.elevationSeed = generateId();
            $('#elevationSeed').val(settings.elevationSeed);
        }
        settings.frequencyElevation = parseFloat($('#frequencyElevation').val()) || 0.8;
        settings.redistributionElevation = parseFloat($('#redistributionElevation').val()) || 1.0;
        settings.elevationOctaves_0 = parseFloat($('#elevationOctaves_0').val()) || 1;
        settings.elevationOctaves_1 = parseFloat($('#elevationOctaves_1').val()) || 0.5;
        settings.elevationOctaves_2 = parseFloat($('#elevationOctaves_2').val()) || 0.25;
        settings.elevationOctaves_3 = parseFloat($('#elevationOctaves_3').val()) || 0.12;
        settings.createIsland = $('#createIsland').is(":checked");
        // Moisture Noise
        settings.setMoistureSeed = $('#setMoistureSeed').is(":checked");
        if (settings.setMoistureSeed) {
            settings.moistureSeed = $('#moistureSeed').val();
        } else {
            settings.moistureSeed = generateId();
            $('#moistureSeed').val(settings.moistureSeed);
        }
        settings.drawMoisture = $('#drawMoisture').is(":checked");
        settings.frequencyMoisture = parseFloat($('#frequencyMoisture').val()) || 0.8;
        settings.redistributionMoisture = parseFloat($('#redistributionMoisture').val()) || 1.0;
        settings.moistureOctaves_0 = parseFloat($('#moistureOctaves_0').val()) || 1;
        settings.moistureOctaves_1 = parseFloat($('#moistureOctaves_1').val()) || 0.5;
        settings.moistureOctaves_2 = parseFloat($('#moistureOctaves_2').val()) || 0.25;
        settings.moistureOctaves_3 = parseFloat($('#moistureOctaves_3').val()) || 0.12;
    }

    viewport = initializeViewport(app, settings);

    loadGrid(app, viewport, settings);

    $("#gridSettingsModal").modal("hide");
    $("#elevationModal").modal("hide");
    $("#moistureModal").modal("hide");
    $("#mapHashModal").modal("hide");
}

function downloadCanvasAsPng() {
    ReImg.fromCanvas(document.querySelector('canvas')).downloadPng('hexGrid.png');
}

function heightMap(settings) {
    const simplex = new SimplexNoise(settings.elevationSeed);
    let elevation = [[]];
    let freq = settings.frequencyElevation;  // increase has a zoom out effect, decrease for zoom in
    for (let x = 0; x < settings.hexColums; x++) {
        elevation[x] = [];
        for (let y = 0; y < settings.hexRows; y++) {
            let nx = (x / settings.hexColums) * freq;
            let ny = (y / settings.hexRows) * freq;

            let e = settings.elevationOctaves_0 * simplex.noise2D(nx, ny)
                + settings.elevationOctaves_1 * simplex.noise2D(4*nx, 4*ny)
                + settings.elevationOctaves_2 * simplex.noise2D(8*nx, 8*ny)
                + settings.elevationOctaves_3 * simplex.noise2D(16*nx, 16*ny);
            e = (e + 1) / 2; // from -1 to 1  --> from 0 to 1

            if (settings.createIsland) {
                let xp = (x / settings.hexColums);
                let yp = (y / settings.hexRows);
                let d = Math.hypot(0.5-xp, 0.5-yp);
                e = (1 + e - (d * 3.5)) / 2;
            }

            if (e < 0) e = 0;
            if (e > 1) e = 1;

            elevation[x][y] = Math.pow(e, settings.redistributionElevation);
        }
    }

    return elevation;
}

function moistureMap(settings) {
    const simplex = new SimplexNoise(settings.moistureSeed);
    let moisture = [[]];
    let freq = settings.frequencyMoisture;  // increase has a zoom out effect, decrease for zoom in
    for (let x = 0; x < settings.hexColums; x++) {
        moisture[x] = [];
        for (let y = 0; y < settings.hexRows; y++) {
            let nx = (x / settings.hexColums) * freq;
            let ny = (y / settings.hexRows) * freq;

            let m = settings.moistureOctaves_0 * simplex.noise2D(nx, ny)
                + settings.moistureOctaves_1 * simplex.noise2D(4*nx, 4*ny)
                + settings.moistureOctaves_2 * simplex.noise2D(8*nx, 8*ny)
                + settings.moistureOctaves_3 * simplex.noise2D(16*nx, 16*ny);
            m = (m + 1) / 2; // from -1 to 1  --> from 0 to 1
            if (m < 0) m = 0;
            if (m > 1) m = 1;
            moisture[x][y] = Math.pow(m, settings.redistributionMoisture);
        }
    }

    return moisture;
}

function dec2hex (dec) {
    return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
function generateId (len) {
    let arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('')
}