export function NumberField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label?: string | null
  placeholder: string
  value: number | ''
  onChange: (value: number | '') => void
}) {
  return (
    <div>
      <label className="mb-6 block text-xl font-semibold text-foreground md:text-2xl">{label}</label>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-lg text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-primary_red focus:ring-4 focus:ring-primary_red/10"
      />
    </div>
  )
}
