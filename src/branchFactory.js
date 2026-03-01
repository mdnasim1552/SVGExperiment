export function buildBranches(Branch){
    const branchConfig = [
        {
            id: 'mpLink',
            order: 99,
            toFront: true,
            source: { x: 1139, y: 593 },
            target: { x: 1101, y: 449 },
            vertices: [
            { x: 1157, y: 543 }, { x: 1169, y: 491 },{ x: 1155, y: 457 }
            ],
            style: { fill: "#C07BAE",stroke: '#000000', strokeWidth:1, organicStrokeSize: 50, organicStrokeThinning: .5, organicStrokeTaper: 0, organicStrokeStartCap: false }
        },
        {
            id: 'myLink',
            order: 10,
            parent: 'mpLink',
            ratio: 0,
            target: { x: 967, y: 1788 },
            vertices: [
            { x: 1072, y: 667 },{x:1014,y:761},{x:931,y:927},{ x: 864, y: 1066 }, { x: 797, y: 1203 },{ x: 782, y: 1323 },{x:782,y:1431}
                ,{x:765,y:1501},{x:815,y:1770},{x:861,y:1896},{x:894,y:1925},{x:935,y:1876}
            ],
            labels: [
                {
                    range: { min: 0.05, max: 0.25 },
                    attrs: { labelText: { text: 'PRCA' } },
                    position: { distance: 0.15, angle: 10 }
                },
                {
                    range: { min: 0.40, max: 0.70 },
                    attrs: { labelText: { text: 'MRCA' } },
                    position: { distance: 0.55, angle: 10 }
                },
                {
                    range: { min: 0.85, max: 1 },
                    attrs: { labelText: { text: 'AMARG' } },
                    position: { distance: 0.95, angle: 10 }
                }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:1, organicStrokeSize: 35, organicStrokeThinning:.3, organicStrokeTaper:1 }
        },
        {
            id: 'myLeftLink',
            order: 4,
            parent: 'mpLink',
            ratio: 0,
            target: { x: 818, y: 816 },
            vertices: [
            { x: 1058, y: 620 },{ x: 977, y: 693 }, { x: 907, y: 735 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 30, organicStrokeThinning:.3, organicStrokeTaper:1 }
        },
        {
            id: 'myLeftBLink',
            order: 2,
            parent: 'myLeftLink',
            ratio: 0.45,
            target: { x: 915, y: 832 },
            vertices: [
                { x: 965, y: 736 },{ x: 953, y: 776 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'myLeftCLink',
            order: 3,
            parent: 'myLink',
            ratio: 0.18,
            target: { x: 734, y: 959 },
            vertices: [
                { x: 939, y: 867 },{ x: 880, y: 882 }, { x: 803, y: 959 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'myLeftDLink',
            order: 3,
            parent: 'myLink',
            ratio: 0.3,
            target: { x: 693, y: 1165 },
            vertices: [
                { x: 836, y: 1042 },{ x: 767, y: 1114 }, { x: 716, y: 1128 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'myRightLink',
            order: 4,
            parent: 'mpLink',
            ratio: 0,
            target: { x: 1241, y: 1290 },
            vertices: [
                { x: 1144, y: 628 },{ x: 1152, y: 839 }, { x: 1144, y: 954 },{ x: 1162, y: 1042 },{ x: 1235, y: 1199 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 30, organicStrokeThinning:.3, organicStrokeTaper:1 }
        },
        {
            id: 'myRightBLink',
            order: 2,
            parent: 'myRightLink',
            ratio: 0.4,
            target: { x: 1283, y: 1103 },
            vertices: [
                { x: 1169, y: 890 },{ x: 1219, y: 1001 }, { x: 1236, y: 1057 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'myRightCLink',
            order: 4,
            parent: 'myLink',
            ratio: 0.17,
            target: { x: 1102, y: 1229 },
            vertices: [
                { x: 1002, y: 924 },{ x: 999, y: 1001 },{ x: 1036, y: 1058 },{ x: 1045, y: 1158 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'myRightDLink',
            order: 2,
            parent: 'myRightCLink',
            ratio: 0.17,
            target: { x: 1079, y: 1052 },
            vertices: [
                { x: 1036, y: 955 },{ x: 1079, y: 1015 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'myRightELink',
            order: 4,
            parent: 'myLink',
            ratio: 0.32,
            target: { x: 934, y: 1277 },
            vertices: [
                { x: 897, y: 1101 },{ x: 900, y: 1209 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'myRightFLink',
            order: 2,
            parent: 'myRightELink',
            ratio: 0.37,
            target: { x: 959, y: 1211 },
            vertices: [
                { x: 941, y: 1163 }
            ],
            style: { fill:"#EFE648", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB0Link',
            order: 10,
            source: { x: 1097, y: 506 },
            target: { x: 1491, y: 1294 },
            vertices: [
            { x: 1124, y: 532 },{ x: 1212, y: 517 },{x:1331,y:510},{x:1443,y:576},{ x: 1541, y: 674 }, { x: 1611, y: 786 },{ x: 1654, y: 895 },{x:1657,y:1007},
                {x:1632,y:1109},{x:1569,y:1214}
            ],
            style: { fill:"#3679BD", stroke: '#000000', strokeWidth:1, organicStrokeSize: 50, organicStrokeThinning: 0.1, organicStrokeTaper:0,organicStrokeStartCap: false }
        },
        {
            id: 'mB0LinkChild01',
            order: 3,
            parent: 'mB0Link',
            ratio: 0.15,
            target: { x: 1297, y: 440 },
            style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 40, organicStrokeThinning:0.8,organicStrokeStartCap:false}
        },
        {
            id: 'mB0LinkChild1',
            order: 5,
            parent: 'mB0Link',
            ratio: 0.1,
            target: { x: 1305, y: 1016 },
            vertices: [
                { x: 1273, y: 573 },{ x: 1289, y: 637 },{ x: 1273, y: 730 },{ x: 1261, y: 782 },{ x: 1273, y: 871 },{ x: 1305, y: 931 }
            ],
            style: { fill:"#6CBE47", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB0LinkChild2',
            order: 2,
            parent: 'mB0LinkChild1',
            ratio: 0.42,
            target: { x: 1362, y: 847 },
            vertices: [
                { x: 1305, y: 806 }
            ],
            style: { fill:"#6CBE47", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB0LinkChild3',
            order: 4,
            parent: 'mB0Link',
            ratio: 0.2,
            target: { x: 1382, y: 1012 },
            vertices: [
                { x: 1378, y: 597 },{ x: 1426, y: 677 },{ x: 1439, y: 758 },{ x: 1430, y: 851 },{ x: 1430, y: 935 }
            ],
            style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB0LinkChild4',
            order: 2,
            parent: 'mB0LinkChild3',
            ratio: 0.5,
            target: { x: 1515, y: 891 },
            vertices: [
                { x: 1463, y: 790 },{ x: 1479, y: 851 }
            ],
            style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB0LinkChild5',
            order: 4,
            parent: 'mB0Link',
            ratio: 0.58,
            target: { x: 1354, y: 1113 },
            vertices: [
                { x: 1620, y: 859 },{ x: 1576, y: 935 },{ x: 1527, y: 996 },{ x: 1475, y: 1012 },{ x: 1430, y: 1080 },{ x: 1394, y: 1113 }
            ],
            style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB0LinkChild6',
            order: 2,
            parent: 'mB0LinkChild5',
            ratio: 0.5,
            target: { x: 1471, y: 1101 },
            vertices: [
                { x: 1515, y: 1024 },{ x: 1503, y: 1072 }
            ],
            style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB0LinkChild7',
            order: 4,
            parent: 'mB0Link',
            ratio: 0.74,
            target: { x: 1334, y: 1246 },
            vertices: [
                { x: 1620, y: 1048 },{ x: 1531, y: 1137 },{ x: 1402, y: 1181 }
            ],
            style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB0LinkChild8',
            order: 2,
            parent: 'mB0LinkChild7',
            ratio: 0.4,
            target: { x: 1503, y: 1205 },
            vertices: [
                { x: 1531, y: 1161 }
            ],
            style: { fill:"#3679BD", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 25, organicStrokeThinning:.3, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB1Link',
            order: 9,
            source: { x: 728, y: 527 },
            target: { x: 920, y: 1738 },
            vertices: [
                {x:696,y:528},{ x: 627, y: 587 },{ x: 568, y: 688 },{ x: 542, y: 812 },{ x: 493, y: 971 },
                { x: 466, y: 1083 },{ x: 503, y: 1198 },{ x: 646, y: 1338 },{ x: 830, y: 1455 },{ x: 846, y: 1522 },
                { x: 852, y: 1619 },{ x: 873, y: 1694 }
            ],
            labels: [
                {
                    range: { min: 0, max: 0.35 },
                    attrs: { labelText: { text: 'PRCA' } },
                    position: { distance: 0.15, angle: 10 }
                },
                {
                    range: { min: 0.36, max: 0.65 },
                    attrs: { labelText: { text: 'MRCA' } },
                    position: { distance: 0.55, angle: 10 }
                },
                {
                    range: { min: 0.66, max: 1 },
                    attrs: { labelText: { text: 'AMARG' } },
                    position: { distance: 0.85, angle: 10 }
                }
            ],
            style: { fill:"#36C6F3", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 35, organicStrokeThinning:0.6, organicStrokeTaper:1, organicStrokeStartCap: false }
        },
        {
            id: 'mB1LinkChild1',
            order: 2,
            parent: 'mB1Link',
            ratio: 0.18,
            target: { x: 889, y: 394 },
            vertices: [
                {x:626,y:673},{ x: 692, y: 616 },{ x: 777, y: 565 },{ x: 800, y: 516 },{ x: 869, y: 456 },
            ],
            style: { fill:"#36C6F3", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:0.6, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB1LinkChild2',
            order: 2,
            parent: 'mB1Link',
            ratio: 0.07,
            target: { x: 546, y: 494 },
            vertices: [
                {x:620,y:522},{ x: 560, y: 442 },{ x: 515, y: 422 },{ x: 520, y: 468 }
            ],
            style: { fill:"#36C6F3", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:0.6, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB1LinkChild3',
            order: 2,
            parent: 'mB1Link',
            ratio: 0.22,
            target: { x: 409, y: 1059 },
            vertices: [
                {x:497,y:798},{ x: 452, y: 828 },{ x: 386, y: 882 },{ x: 323, y: 911 },
                { x: 280, y: 931 },{ x: 238, y: 982 },{ x: 252, y: 1008 },{ x: 277, y: 1011 },
                { x: 326, y: 993 },{ x: 352, y: 1011 },{ x: 369, y: 1048 }
            ],
            style: { fill:"#36C6F3", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 20, organicStrokeThinning:0.6, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB1LinkChild4',
            order: 2,
            parent: 'mB1Link',
            ratio: 0.35,
            target: { x: 583, y: 1056 },
            vertices: [
                {x:526,y:1025}
            ],
            style: { fill:"#36C6F3", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 30, organicStrokeThinning:0.6, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB1LinkChild5',
            order: 2,
            parent: 'mB1Link',
            ratio: 0.43,
            target: { x: 700, y: 1590 },
            vertices: [
                {x:437,y:1145},{ x: 395, y: 1256 },{ x: 375, y: 1382 },{ x: 452, y: 1428 },{ x: 503, y: 1453 },{ x: 549, y: 1490 },
                { x: 595, y: 1542 },{ x: 620, y: 1573 },{ x: 700, y: 1590 }
            ],
            style: { fill:"#36C6F3", stroke: '#000000', strokeWidth:0.5, organicStrokeSize: 30, organicStrokeThinning:0.6, organicStrokeTaper:1,organicStrokeStartCap:false }
        },
        {
            id: 'mB2Link',
            order: 8,
            source: { x: 827, y: 1431 },
            target: { x: 1491, y: 1294 },
            vertices: [
                {x:894,y:1382},{x:945,y:1335},{x:994,y:1296},{ x: 1040, y: 1345 },{ x: 1109, y: 1390 },{ x: 1189, y: 1416 },{ x: 1260, y: 1428 },{ x: 1323, y: 1416 },
                { x: 1400, y: 1371 },{ x: 1453, y: 1327 }
            ],
            style: { fill:"#007F9D", stroke: '#000000', strokeWidth:5, organicStrokeSize: 35, organicStrokeThinning:0, organicStrokeTaper:0, organicStrokeStartCap: false,strokeDasharray: '20 20',strokeDashoffset: 0}
        },
        {
            id: 'mB2LinkChild1',
            order: 2,
            parent: 'mB2Link',
            ratio: 0.75,
            target: { x: 1216, y: 1731 },
            vertices: [
                {x:1306,y:1457},{x:1290,y:1492},{x:1283,y:1542},{ x: 1287, y: 1605 },{ x: 1276, y: 1660 },{ x: 1254, y: 1702 }
            ],
            style: { fill:"#007F9D", stroke: '#000000', strokeWidth:5, organicStrokeSize: 20, organicStrokeThinning:0.6, organicStrokeTaper:1,strokeDasharray: '20 20',strokeDashoffset: 0,organicStrokeStartCap:false}
        },
        {
            id: 'mB2LinkChild2',
            order: 2,
            parent: 'mB2Link',
            ratio: 0.6,
            target: { x: 1172, y: 1765 },
            vertices: [
                {x:1204,y:1447},{x:1190,y:1504},{x:1205,y:1558},{ x: 1198, y: 1600 },{ x: 1167, y: 1643 },{ x: 1153, y: 1669 },
                { x: 1150, y: 1705 },{ x: 1152, y: 1731 },
            ],
            style: { fill:"#007F9D", stroke: '#000000', strokeWidth:5, organicStrokeSize: 20, organicStrokeThinning:0.6, organicStrokeTaper:1,strokeDasharray: '20 20',strokeDashoffset: 0,organicStrokeStartCap:false}
        },
        {
            id: 'mB2LinkChild3',
            order: 2,
            parent: 'mB2Link',
            ratio: 0.48,
            target: { x: 1091, y: 1764 },
            vertices: [
                {x:1120,y:1427},{x:1117,y:1603},{x:1082,y:1658},{ x: 1079, y: 1701 },
            ],
            style: { fill:"#007F9D", stroke: '#000000', strokeWidth:5, organicStrokeSize: 20, organicStrokeThinning:0.6, organicStrokeTaper:1,strokeDasharray: '20 20',strokeDashoffset: 0,organicStrokeStartCap:false}
        },
        {
            id: 'mB2LinkChild4',
            order: 5,
            parent: 'mB2Link',
            ratio: 0.28,
            target: { x: 1013, y: 1777 },
            vertices: [
                {x:1010,y:1372},{x:1004,y:1460},{x:1006,y:1554},{ x: 1015, y: 1664 },
            ],
            style: { fill:"#007F9D", stroke: '#000000', strokeWidth:5, organicStrokeSize: 30, organicStrokeThinning:0.6, organicStrokeTaper:1,strokeDasharray: '20 20',strokeDashoffset: 0,organicStrokeStartCap:false}
        },
        {
            id: 'mB2LinkChild5',
            order: 2,
            parent: 'mB2LinkChild4',
            ratio: 0.25,
            target: { x: 842, y: 1268 },
            vertices: [
                {x:981,y:1399},{x:938,y:1370},{x:890,y:1328},{ x: 852, y: 1287 }
            ],
            style: { fill:"#007F9D", stroke: '#000000', strokeWidth:5, organicStrokeSize: 20, organicStrokeThinning:0.6, organicStrokeTaper:1,strokeDasharray: '20 20',strokeDashoffset: 0,organicStrokeStartCap:false}
        },
        {
            id: 'mB2LinkChild6',
            order: 2,
            parent: 'mB2LinkChild4',
            ratio: 0.54,
            target: { x: 909, y: 1504 },
            vertices: [
                {x:984,y:1547}
            ],
            style: { fill:"#007F9D", stroke: '#000000', strokeWidth:5, organicStrokeSize: 20, organicStrokeThinning:0.6, organicStrokeTaper:1,strokeDasharray: '20 20',strokeDashoffset: 0,organicStrokeStartCap:false}
        },
        {
            id: 'mB2LinkChild7',
            order: 2,
            parent: 'mB2LinkChild4',
            ratio: 0.77,
            target: { x: 931, y: 1612 },
            vertices: [
                {x:992,y:1657}
            ],
            style: { fill:"#007F9D", stroke: '#000000', strokeWidth:5, organicStrokeSize: 20, organicStrokeThinning:0.6, organicStrokeTaper:1,strokeDasharray: '20 20',strokeDashoffset: 0,organicStrokeStartCap:false}
        },
    ];
    //const sortedConfig = [...branchConfig].sort((a, b) => a.order - b.order);
    const createdLinks = {};
    const cells = [];

    branchConfig.forEach(cfg => {
        // Build source
        let source;

        if (cfg.parent) {
            source = {
            id: createdLinks[cfg.parent].id,
            anchor: {
                name: 'connectionRatio',
                args: { ratio: cfg.ratio ?? 0 }
            }
            };
        } else {
            source = cfg.source;
        }
        const lineAttrs = {
        ...(cfg.style?.fill !== undefined && { fill: cfg.style.fill }),
        ...(cfg.style?.stroke !== undefined && { stroke: cfg.style.stroke }),
        ...(cfg.style?.strokeWidth !== undefined && { strokeWidth: cfg.style.strokeWidth }),
        ...(cfg.style?.strokeDasharray !== undefined && { strokeDasharray: cfg.style.strokeDasharray }),
        ...(cfg.style?.strokeDashoffset !== undefined && { strokeDashoffset: cfg.style.strokeDashoffset }),
        ...(cfg.style?.organicStrokeSize !== undefined && { organicStrokeSize: cfg.style.organicStrokeSize }),
        ...(cfg.style?.organicStrokeThinning !== undefined && { organicStrokeThinning: cfg.style.organicStrokeThinning }),
        ...(cfg.style?.organicStrokeTaper !== undefined && { organicStrokeTaper: cfg.style.organicStrokeTaper }),
        ...(cfg.style?.organicStrokeStartCap !== undefined && { organicStrokeStartCap: cfg.style.organicStrokeStartCap })
        };
        const link = new Branch({
            id:cfg.id,
            source,
            target: cfg.target,
            vertices: cfg.vertices || [],
            ...(cfg.labels && { labels: cfg.labels }),
            ...(Object.keys(lineAttrs).length && {
                attrs: { line: lineAttrs }
            }),
            ...(cfg.order != null && { z: cfg.order }) // store z-index
        });
        // if(cfg.order>=4) {
        //     //link.toFront();
        //     link.set('z', cfg.order);
        // }
        createdLinks[cfg.id] = link;
        cells.push(link);
    });
    return { cells, branchConfig };
}

