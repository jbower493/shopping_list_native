const primitive = {
    colorWhite: '#ffffff',
    colorBlack: '#000000',
    colorPrimary: '#10B981',
    colorGray: '#d1d5db',
    colorGray100: '#f9fafb',
    colorGray200: '#f3f4f6',
    colorGray400: '#d1d5dc',
    colorRed: '#ef4444',

    borderRadius5: 5,
    borderRadius10: 10
}

export const semantic = {
    colorTextDefault: primitive.colorBlack,
    colorTextInverse: primitive.colorWhite,
    colorTextPrimary: primitive.colorPrimary,
    colorTextError: primitive.colorRed,
    colorBackgroundDefault: primitive.colorWhite,
    colorBackgroundInverse: primitive.colorBlack,
    colorBackgroundPrimary: primitive.colorPrimary,
    colorBackgroundSecondary: primitive.colorGray200,
    colorBackgroundError: primitive.colorRed,
    colorBorderPrimary: primitive.colorPrimary,
    colorBorderDefault: primitive.colorGray,

    borderRadiusDefault: primitive.borderRadius5,
    borderRadiusRounded: primitive.borderRadius10
}

export const component = {
    ModalFooter_colorBackground: primitive.colorGray100,
    Button_colorBackgroundDisabled: primitive.colorGray400
}
