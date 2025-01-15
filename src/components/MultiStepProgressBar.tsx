import './MultiStepProgressBar.css'

export interface Step {
  label: string
  value: string,
  id: number,
  last: boolean
}

const MultiStepProgressBar = ({
  steps,
  onChangeStep,
  selectedStep,
}: {
  steps: Step[]
  onChangeStep: (step: Step) => void
  selectedStep: Step
}) => {
  return (
    <div>
      <ul className='multi-steps'>
        {steps.map((step, index) => (
          <li
            key={index}
            className={`${selectedStep.value === step.value ? 'is-active' : ''}`}
            onClick={() => {
              onChangeStep(step);
            }}
          >
            <sub>{step.label}</sub>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MultiStepProgressBar
