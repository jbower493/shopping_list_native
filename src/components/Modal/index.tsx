import { _ModalBody } from './_Body'
import { _ModalFooter } from './_Footer'
import { _ModalHeader } from './_Header'
import { _Modal } from './_Modal'

export const Modal = Object.assign(_Modal, {
    Header: _ModalHeader,
    Body: _ModalBody,
    Footer: _ModalFooter
})
