import * as z from 'zod'

type Inputs = {
    name: string
    recipeCategoryId: string
    instructions: string
    prepTime: string
    serves: string
}

const schema = z.object({
    name: z.string().min(1, 'Required'),
    instructions: z.string(),
    recipeCategoryId: z.string(),
    prepTime: z.coerce.number(),
    serves: z.coerce.number()
})

export function NewRecipeForm() {
    return null
}
