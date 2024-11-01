import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global() // Make it global so it can be used across the application
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService], // Export the service
})
export class FirebaseModule {}
