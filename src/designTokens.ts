const primitive = {
    colorWhite: '#ffffff',
    colorBlack: '#000000',
    colorPrimary: '#10B981',
    colorGray: '#d1d5db',
    colorGray100: '#f9fafb',
    colorGray200: '#f3f4f6',
    colorGray400: '#d1d5dc',
    colorRed: '#ef4444',
    colorSky: '#00a6f4',
    colorGreen: '#00c951',

    borderRadius5: 5,
    borderRadius10: 10,

    padding15: 15,

    gap15: 15
}

export const semantic = {
    colorTextDefault: primitive.colorBlack,
    colorTextInverse: primitive.colorWhite,
    colorTextPrimary: primitive.colorPrimary,
    colorTextError: primitive.colorRed,
    colorTextInfo: primitive.colorSky,
    colorBackgroundDefault: primitive.colorWhite,
    colorBackgroundInverse: primitive.colorBlack,
    colorBackgroundPrimary: primitive.colorPrimary,
    colorBackgroundSecondary: primitive.colorGray200,
    colorBackgroundError: primitive.colorRed,
    colorBackgroundInfo: primitive.colorSky,
    colorBackgroundSuccess: primitive.colorGreen,
    colorBorderPrimary: primitive.colorPrimary,
    colorBorderDefault: primitive.colorGray,

    borderRadiusDefault: primitive.borderRadius5,
    borderRadiusRounded: primitive.borderRadius10,

    paddingDefault: primitive.padding15
}

export const component = {
    ModalFooter_colorBackground: primitive.colorGray100,
    Button_colorBackgroundDisabled: primitive.colorGray400,
    actions_gapDefault: primitive.gap15
}
