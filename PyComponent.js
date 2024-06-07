const { parse } = require('python-ast');

function parsePythonCode(code) {
    return parse(code);
}

function findParents(tree) {
    const parents = {};
    const functions = {};
    let className = "";

    function walk(node) {
        if (node.type === 'FunctionDef') {
            parents[node.name] = className;
            functions[node.name] = node;
        } else if (node.type === 'ClassDef') {
            className = node.name;
            node.body.forEach(subnode => {
                if (subnode.type === 'FunctionDef') {
                    parents[subnode.name] = className;
                    functions[subnode.name] = subnode;
                }
            });
        }
        if (node.body) {
            node.body.forEach(walk);
        }
    }

    walk(tree);

    return { parents, functions };
}

function analyzePythonCode(code) {
    const tree = parsePythonCode(code);
    const { parents, functions } = findParents(tree);

    const outputData = {};
    for (const name in parents) {
        outputData[name] = {
            Type: parents[name] ? 'Function' : 'Class',
            Parent: parents[name],
            Contents: functions[name].raw
        };
    }

    return JSON.stringify(outputData, null, 4);
}

module.exports = { analyzePythonCode };
