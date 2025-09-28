import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LucideLock, LucideMail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import z from 'zod'

import { Button } from '@/ui/button'
import { CardContent, CardFooter } from '@/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'

import { useSignIn } from '@/hooks'
import * as API from '@/api'

const schema = z
  .object({
    email: z.email({
      error: 'Некорректный формат email'
    }),
    password: z.string().min(3, 'Введите пароль'),
    passwordConfirm: z.string().min(3, 'Введите пароль повторно')
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Пароли не совпадают',
    path: ['passwordConfirm']
  })

type FormSchema = z.infer<typeof schema>

export const SignUpPage = () => {
  const { signIn, isSigningIn } = useSignIn()

  const { mutate: signUp, isPending: isSigningUp } = useMutation({
    mutationFn: API.signUp,
    onSuccess: (_, { email, password }) => {
      signIn({ email, password })
    }
  })

  const useFormProps = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: ''
    }
  })
  const { handleSubmit, control } = useFormProps

  const onFormSubmit = ({ email, password }: FormSchema) => {
    signUp({ email, password })
  }

  return (
    <>
      <CardContent>
        <Form {...useFormProps}>
          <form className='flex flex-col gap-6' onSubmit={handleSubmit(onFormSubmit)}>
            <FormField
              control={control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <div className='relative w-full'>
                      <LucideMail className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-500' />

                      <Input
                        type='email'
                        placeholder='Введите e-mail'
                        className='pl-10'
                        {...field}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>

                  <FormControl>
                    <div className='relative w-full'>
                      <LucideLock className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-500' />

                      <Input
                        type='password'
                        placeholder='Введите пароль'
                        className='pl-10'
                        {...field}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='passwordConfirm'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подтвердите пароль</FormLabel>

                  <FormControl>
                    <div className='relative w-full'>
                      <LucideLock className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-500' />

                      <Input
                        type='password'
                        placeholder='Введите пароль повторно'
                        className='pl-10'
                        {...field}
                      />
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              loading={isSigningUp || isSigningIn}
              type='submit'
              className='h-12 w-full bg-blue-600 hover:bg-blue-700'
            >
              Зарегистрироваться
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className='justify-center'>
        <p>
          Уже есть аккаунт?{' '}
          <Link to='/sign-in' className='font-medium text-sky-500'>
            Войти
          </Link>
        </p>
      </CardFooter>
    </>
  )
}
