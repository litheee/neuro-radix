import { zodResolver } from '@hookform/resolvers/zod'
import { LucideLock, LucideMail } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'

import { Button } from '@/ui/button'
import { CardContent, CardFooter } from '@/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form'
import { Input } from '@/ui/input'

import { useSignIn } from '@/hooks'

const schema = z.object({
  email: z.email({
    error: 'Некорректный формат email'
  }),
  password: z.string().min(3, 'Введите пароль')
})

type FormSchema = z.infer<typeof schema>

export const SignInPage = () => {
  const { signIn, isSigningIn, error } = useSignIn()
  console.log(error)
  const useFormProps = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  })
  const { handleSubmit, control } = useFormProps

  const onFormSubmit = ({ email, password }: FormSchema) => {
    signIn({ email, password })
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
                        autoComplete='username'
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
                        autoComplete='current-password'
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
              loading={isSigningIn}
              type='submit'
              className='h-12 w-full bg-blue-600 hover:bg-blue-700'
            >
              Войти
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className='justify-center'>
        <p>
          Ещё нет аккаунта?{' '}
          <Link to='/sign-up' className='font-medium text-sky-500'>
            Зарегистрироваться
          </Link>
        </p>
      </CardFooter>
    </>
  )
}
