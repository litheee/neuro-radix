import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  LucideCopy,
  LucideEye,
  LucideKeyRound,
  LucideMail,
  LucideRefreshCw,
  LucideUser
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/ui/card'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

import { useAuth } from '@/providers'
import * as API from '@/api'
import { generateToken } from '@/lib/generateToken'

export const ProfilePage = () => {
  const queryClient = useQueryClient()
  const { userEmail, logout } = useAuth()

  const [isTokenVisible, setTokenVisible] = useState(false)

  const { data: apiKeys = [] } = useQuery({
    queryKey: ['api-keys'],
    queryFn: API.getApiKeys
  })

  const { mutate: createApiKey, isPending: isApiKeyCreating } = useMutation({
    mutationFn: API.createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['api-keys']
      })
    }
  })

  const getLastToken = () => {
    const notRevokedTokens = apiKeys.filter(({ revoked }) => !revoked)

    if (!notRevokedTokens.length) return ''

    return notRevokedTokens[notRevokedTokens.length - 1].name
  }

  const lastToken = getLastToken()

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(lastToken)
  }

  return (
    <div>
      <div className='flex flex-col items-start justify-between'>
        <h1 className='mb-2 text-3xl font-bold text-gray-900'>Аккаунт и Настройки</h1>
        <p className='text-gray-600'>Управляйте вашей информацией, настройками и API доступом</p>
      </div>

      <Card className='mt-8'>
        <CardHeader>
          <h3 className='flex items-center gap-3 text-2xl leading-none font-semibold tracking-tight'>
            <LucideUser /> Профиль пользователя
          </h3>
        </CardHeader>

        <CardContent>
          <div>
            <Label className='text-gray-500'>
              <LucideMail className='h-4 w-4' /> Email
            </Label>

            <p className='text-lg'>{userEmail}</p>
          </div>
        </CardContent>
      </Card>

      <Card className='mt-8'>
        <CardHeader>
          <h3 className='flex items-center gap-3 text-2xl leading-none font-semibold tracking-tight'>
            <LucideKeyRound /> API Токен
          </h3>

          <p className='mt-1.5 text-sm text-muted-foreground'>
            Используйте этот токен для доступа к API сервиса. Не делитесь им ни с кем.
          </p>
        </CardHeader>

        <CardContent>
          <div className='flex gap-2'>
            <Input
              readOnly
              type={isTokenVisible ? 'text' : 'password'}
              value={lastToken}
              className='h-10'
            />

            <Button
              variant='outline'
              className='h-10 w-10'
              onClick={() => {
                setTokenVisible(!isTokenVisible)
              }}
            >
              <LucideEye />
            </Button>

            <Button variant='outline' className='h-10 w-10' onClick={copyTokenToClipboard}>
              <LucideCopy />
            </Button>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            loading={isApiKeyCreating}
            className='h-10 bg-blue-600 px-4! hover:bg-blue-700'
            onClick={() => {
              createApiKey(generateToken())
            }}
          >
            <LucideRefreshCw /> {!lastToken ? 'Сгенерировать токен' : 'Перегенерировать токен'}
          </Button>
        </CardFooter>
      </Card>

      <Button className='mt-5 h-10 w-full max-w-25 bg-blue-600 hover:bg-blue-700' onClick={logout}>
        Выйти
      </Button>
    </div>
  )
}
