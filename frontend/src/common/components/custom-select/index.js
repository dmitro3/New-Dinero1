import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function CustomSelect({
  options = [],
  selectedValue,
  onValueChange,
  placeholder = 'Select a value',
  className,
  contentClassName = '',
  // ...props
}) {

  return (
    <Select value={selectedValue} onValueChange={onValueChange}>
      <SelectTrigger
        className={`w-[180px] bg-[rgb(var(--secondary-btn-color))] text-white border-[rgb(var(--secondary-btn-color))] hover:bg-[hsl(var(--lb-blue-800))] ${className}`}
      >
        <SelectValue placeholder={placeholder} className="text-white" />
      </SelectTrigger>
      <SelectContent
        className={`bg-[rgb(var(--secondary-btn-color))] border-[rgb(var(--secondary-btn-color))] ${contentClassName}`}
      >
        <SelectGroup>
          {options.map((option) => (
            <SelectItem
              key={option?.value}
              value={option?.value}
              className="text-white bg-[hsl(var(--lb-blue-950))] hover:bg-[hsl(var(--lb-blue-950))]"
            >
              {option?.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}



export default CustomSelect;
