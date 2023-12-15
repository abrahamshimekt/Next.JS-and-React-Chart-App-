// import EmailForm from '@/components/EmailContent';
import VerificationSuccess from '@/components/auth/activate-account/VerificationSuccess';
import '../../globals.css';
import { Toaster } from "react-hot-toast";

export default function index({ params }: { params: { slug: string }}) {
  return (
    <div >
      <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{
            margin: "8px",
          }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      <VerificationSuccess id={params.slug[0]} token={params.slug[1]} />
    </div>
  );
}
