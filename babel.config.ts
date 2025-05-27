interface BabelApi {
    cache: (forever: boolean) => void;
}

interface BabelPresetExpoOptions {
    unstable_transformImportMeta: boolean;
}

interface BabelConfig {
    presets: [
        [
            string,
            BabelPresetExpoOptions
        ]
    ];
}

module.exports = function (api: BabelApi): BabelConfig {
    api.cache(true);
    return {
        presets: [
            [
                'babel-preset-expo',
                {
                    unstable_transformImportMeta: true,
                },
            ],
        ],
    };
};
