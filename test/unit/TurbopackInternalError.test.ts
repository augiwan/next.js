import path from 'path'
import os from 'os'
import { TurbopackInternalError } from 'next/dist/shared/lib/turbopack/utils'
import { eventErrorThrown } from 'next/dist/telemetry/events/build'
import { Telemetry } from 'next/dist/telemetry/storage'
import { setGlobal } from 'next/dist/trace'
import { traceGlobals } from 'next/dist/trace/shared'

describe('TurbopackInternalError', () => {
  it('sends a telemetry event when TurbopackInternalError.createAndRecordTelemetry() is called', async () => {
    const oldTelemetry = traceGlobals.get('telemetry')

    try {
      const distDir = path.join(os.tmpdir(), 'next-telemetry')
      const telemetry = new Telemetry({ distDir })
      setGlobal('telemetry', telemetry)
      const submitRecord = jest
        // @ts-ignore
        .spyOn(telemetry, 'submitRecord')
        // @ts-ignore
        .mockImplementation(() => Promise.resolve())
      const error = new Error('Test error')
      const event = TurbopackInternalError.createAndRecordTelemetry(error)
      expect(submitRecord).toHaveBeenCalledWith(eventErrorThrown(event))
    } finally {
      setGlobal('telemetry', oldTelemetry)
    }
  })
})
