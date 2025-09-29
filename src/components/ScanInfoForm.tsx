import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Card, CardContent, CardHeader } from '@/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'
import { Textarea } from '@/ui/textarea'

const schema = z.object({
  date: z.string(),
  comment: z.string().max(300, 'Максимальное количество символов 300')
})

type FormSchema = z.infer<typeof schema>

export const ScanInfoForm = () => {
  const useFormProps = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: '',
      comment: ''
    }
  })
  const { control, handleSubmit } = useFormProps

  const onFormSubmit = ({ comment, date }: FormSchema) => {
    // console.log({ comment, date })
  }

  return (
    <Card>
      <CardHeader>
        <h3 className='text-xl font-semibold tracking-tight text-gray-900 dark:text-white'>
          Информация об исследовании
        </h3>
      </CardHeader>

      <CardContent>
        <Form {...useFormProps}>
          <form className='flex flex-col gap-5' onSubmit={handleSubmit(onFormSubmit)}>
            <FormField
              control={control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата исследования</FormLabel>

                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='comment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дополнительные комментарии</FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder='Введите дополнительную информацию об исследовании'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
