export default (nodecg) => {
    nodecg.extensions['ipl-overlay-controls'].bundleConfigDeclarationService.declareCustomScenes(nodecg.bundleName, [
        {
            value: 'casters',
            names: {
                EN: 'Casters'
            }
        },
        {
            value: 'bracket',
            names: {
                EN: 'Bracket'
            }
        }
    ]);
};
