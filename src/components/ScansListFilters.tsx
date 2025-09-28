import { zodResolver } from '@hookform/resolvers/zod'
import { Filter, Search } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { Form, FormField } from '@/ui/form'
import { Input } from '@/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'

import type { ScanStatus } from '@/types/scans.types'

const SCAN_STATUSES: { label: string; value: ScanStatus | 'all' }[] = [
  { label: 'Все статусы', value: 'all' },
  { label: 'В обработке', value: 'processing' },
  { label: 'Готово', value: 'done' },
  { label: 'Ошибка', value: 'invalid_extension' }
]

const schema = z.object({
  search: z.string(),
  status: z.enum([...SCAN_STATUSES.map(({ value }) => value), 'all'] as const)
})

type FormSchema = z.infer<typeof schema>

type ScansListFiltersProps = {
  onFilterChange: (filters: Partial<FormSchema>) => void
}

export const ScansListFilters = ({ onFilterChange }: ScansListFiltersProps) => {
  const useFormProps = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: '',
      status: SCAN_STATUSES[0].value
    }
  })
  const { control, watch } = useFormProps

  useEffect(() => {
    const subscription = watch((values) => {
      onFilterChange(values)
    })

    return () => subscription.unsubscribe()
  }, [watch, onFilterChange])

  return (
    <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-xs'>
      <Form {...useFormProps}>
        <form className='flex w-full gap-4'>
          <FormField
            control={control}
            name='search'
            render={({ field }) => (
              <div className='relative w-full'>
                <Search className='absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-500' />

                <Input className='h-12 py-2 pl-10' placeholder='Поиск по названию...' {...field} />
              </div>
            )}
          />

          <div className='flex gap-3'>
            <div className='flex items-center gap-2'>
              <Filter className='h-5 w-5 text-gray-500 dark:text-gray-400' />
            </div>

            <FormField
              control={control}
              name='status'
              render={({ field }) => {
                return (
                  <Select defaultValue={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className='w-40'>
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      {SCAN_STATUSES.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              }}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}
