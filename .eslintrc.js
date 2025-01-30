module.exports = {
    root: true,
    extends: ['@react-native', '@jbower493/eslint-config-typescript'],
    rules: {
        'linebreak-style': ['off'],
        indent: ['warn', 4, { SwitchCase: 1 }],
        '@typescript-eslint/no-var-requires': ['off'],
        '@typescript-eslint/ban-ts-comment': ['off'],
        'react/react-in-jsx-scope': ['off'],
        'comma-dangle': 'off',
        'jsx-quotes': 'off',
        'react-native/no-inline-styles': 'off',
        'handle-callback-err': 'off',
        'react-hooks/exhaustive-deps': 'off'
    }
}
