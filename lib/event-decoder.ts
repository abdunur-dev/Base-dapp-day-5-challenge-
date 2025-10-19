export interface DecodedEventData {
  [key: string]: any
}

export function decodeEventData(log: any, eventAbi: any): DecodedEventData {
  const decoded: DecodedEventData = {}

  try {
    // Extract indexed parameters from topics
    const topics = log.topics.slice(1) // Skip first topic (event signature)
    const indexedInputs = eventAbi.inputs.filter((input: any) => input.indexed)

    indexedInputs.forEach((input: any, index: number) => {
      if (topics[index]) {
        decoded[input.name] = decodeParameter(input.type, topics[index])
      }
    })

    // Extract non-indexed parameters from data
    const nonIndexedInputs = eventAbi.inputs.filter((input: any) => !input.indexed)
    if (nonIndexedInputs.length > 0 && log.data && log.data !== "0x") {
      const dataValues = decodeParameters(
        nonIndexedInputs.map((i: any) => i.type),
        log.data,
      )
      nonIndexedInputs.forEach((input: any, index: number) => {
        decoded[input.name] = dataValues[index]
      })
    }
  } catch (error) {
    console.error("Error decoding event data:", error)
  }

  return decoded
}

function decodeParameter(type: string, value: string): any {
  // Simplified decoder - in production use ethers.js or viem
  if (type === "address") {
    return "0x" + value.slice(-40)
  }
  if (type.startsWith("uint") || type.startsWith("int")) {
    return BigInt(value).toString()
  }
  if (type === "bool") {
    return value === "0x0000000000000000000000000000000000000000000000000000000000000001"
  }
  return value
}

function decodeParameters(types: string[], data: string): any[] {
  // Simplified decoder - in production use ethers.js or viem
  const values: any[] = []
  let offset = 2 // Skip '0x'

  types.forEach((type) => {
    const chunk = data.slice(offset, offset + 64)
    values.push(decodeParameter(type, "0x" + chunk))
    offset += 64
  })

  return values
}

export function getEventSignature(eventAbi: any): string {
  const inputs = eventAbi.inputs.map((i: any) => i.type).join(",")
  return `${eventAbi.name}(${inputs})`
}

export function hashEventSignature(signature: string): string {
  // Simplified keccak256 - in production use ethers.js or viem
  return (
    "0x" +
    signature
      .split("")
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
      .toString(16)
      .padStart(64, "0")
  )
}
