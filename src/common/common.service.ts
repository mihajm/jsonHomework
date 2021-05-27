import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DiseaseService } from 'src/disease/disease.service';
import { DoctorService } from 'src/doctor/doctor.service';
import { EventLogger } from 'src/event-logger/event-logger.service';
import { PatientService } from 'src/patient/patient.service';

@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => EventLogger))
    private readonly eventLogger: EventLogger,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
    private readonly diseaseService: DiseaseService,
  ) {
    this.eventLogger.setContext('Global');
  }
  async tryCatchWrapper(context: string, payload: string, wrappedFunction) {
    this.eventLogger.setContext(context);
    try {
      await this.eventLogger.storeLog({
        context: this.eventLogger['context'],
        payload,
      });
      return await wrappedFunction;
    } catch (err) {
      await this.eventLogger.storeLog({
        context: this.eventLogger['context'],
        payload,
        errorMsg: `Error ${err.response.statusCode}: ${err.response.message}`,
      });
      return `Error ${err.response.statusCode}: ${err.response.message}`;
    }
  }
}
