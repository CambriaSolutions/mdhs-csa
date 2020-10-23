import dotenv from 'dotenv'
dotenv.config()

const options = {
  method: 'GET',
  url: process.env.HEALTH_CHECK_URL,
}

const healthCheck = async () => {
  const rp = await import('request-promise')

  try {
    await rp(options)
  } catch (err) {
    console.error(err.message, err)
  }
}

export default healthCheck