import 'dotenv/config';
import { app } from '.';

app.listen(process.env.PORT || 3000, () => {
    console.log('Api running');
});
