
const currentStep = ref<number>(1)


function setCurrentStep (step: number) {
  currentStep.value = step
}

export function useExcelLinker () {
  return {
    currentStep,
    setCurrentStep
  }
}