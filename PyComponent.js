const esprima = require('esprima');

function parseJavaScriptCode(code) {
    return esprima.parseScript(code, { range: true });
}

function findParents(tree) {
    const parents = {};
    const functions = {};

    tree.body.forEach(node => {
        if (node.type === 'FunctionDeclaration') {
            parents[node.id.name] = "";
            functions[node.id.name] = code.slice(...node.range);
        } else if (node.type === 'ClassDeclaration') {
            const className = node.id.name;
            node.body.body.forEach(subnode => {
                if (subnode.type === 'MethodDefinition') {
                    const methodName = subnode.key.name;
                    parents[methodName] = className;
                    functions[methodName] = code.slice(...subnode.range);
                }
            });
        }
    });

    return { parents, functions };
}

function analyzeJavaScriptCode(code) {
    const tree = parseJavaScriptCode(code);
    const { parents, functions } = findParents(tree);

    const outputData = {};
    for (const name in parents) {
        outputData[name] = {
            Type: parents[name] ? 'Method' : 'Function',
            Parent: parents[name],
            Contents: functions[name]
        };
    }

    return JSON.stringify(outputData, null, 4);
}

module.exports = { analyzeJavaScriptCode };
