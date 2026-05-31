'use client';

import Image from 'next/image';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { UserDto, UserMapper } from '@app/infrastructure/dtos';
import { useMemo, useState } from 'react';
import { RocketLaunchRounded } from '@mui/icons-material';
import { clientContainer } from '@app/client-injection';
import { ExtendUserMembership } from '@app/application';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { useRouter } from 'next/navigation';

type Props = {
  user: UserDto;
  allowReregistration: boolean;
  allowExpiredReregistration: boolean;
  startReregistrationDate: Date | null;
  endReregistrationDate: Date | null;
};

export function ReregistrationView({
  user,
  allowReregistration,
  allowExpiredReregistration,
  startReregistrationDate,
  endReregistrationDate,
}: Props) {
  const extendUserMembership = useMemo(
    () => clientContainer.get<ExtendUserMembership>(SYMBOLS.ExtendUserMembership),
    [],
  );
  const router = useRouter();

  const now = new Date().getTime();
  const parsedUser = useMemo(() => UserMapper.fromDtoToDomain(user), [user]);
  const [tncOpen, setTncOpen] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const handleExtendAccept = async () => {
    setIsExtending(true);
    const result = await extendUserMembership.execute(parsedUser.id);
    match(result, {
      onRight: () => {
        setTncOpen(false);
        router.refresh();
      },
      onLeft: (error) => {
        console.error('Failed to extend membership:', error);
      },
    });
    setIsExtending(false);
  };

  if (
    allowReregistration &&
    now >= (startReregistrationDate?.getTime() ?? 0) &&
    now <= (endReregistrationDate?.getTime() ?? Infinity)
  ) {
    if (!allowExpiredReregistration && !parsedUser.isActive) {
      return (
        <Box
          component="section"
          className="mb-4 flex h-[calc(100vh-18rem)] min-h-60 w-full items-center justify-center px-6"
        >
          <Container maxWidth={false} className="max-w-2xl p-0">
            <Image
              src="/assets/images/feeling-blue.svg"
              alt="Not allowed"
              width={300}
              height={300}
              loading="eager"
              className="mx-auto block"
            />
            <Typography variant="h6" component="p" align="center" className="mt-8">
              Membership extension is not allowed for expired members.
            </Typography>
            <Typography variant="body1" align="center" className="mt-2">
              Please contact the Core Team for more information.
            </Typography>
          </Container>
        </Box>
      );
    } else if (
      (endReregistrationDate?.getTime() ?? 0) + 335 * 24 * 60 * 60 * 1000 <
      (parsedUser.endDate?.getTime() ?? 0)
    ) {
      return (
        <Box
          component="section"
          className="mb-4 flex h-[calc(100vh-18rem)] min-h-60 w-full items-center justify-center px-6"
        >
          <Container maxWidth={false} className="max-w-2xl p-0">
            <Image
              src="/assets/images/jogging.svg"
              alt="Membership valid"
              width={300}
              height={300}
              loading="eager"
              className="mx-auto block"
            />
            <Typography variant="h6" component="p" align="center" className="mt-8">
              You&apos;re all set! Let&apos;s push something to production!
            </Typography>
            {parsedUser.endDate ? (
              <Typography variant="body1" align="center" className="mt-2">
                Your membership is valid until{' '}
                {DateTime.fromJSDate(parsedUser.endDate).toFormat('dd/LL/yyyy, HH:mm:ss ZZZZ')}.
              </Typography>
            ) : null}
          </Container>
        </Box>
      );
    } else {
      return (
        <>
          <Dialog
            open={tncOpen}
            maxWidth="sm"
            fullWidth
            aria-labelledby="tnc-dialog-title"
            aria-describedby="tnc-dialog-description"
            role="alertdialog"
            onClose={() => setTncOpen(false)}
            slotProps={{
              paper: {
                className: 'rounded-2xl',
              },
            }}
          >
            <DialogTitle className="pt-6">Extend INFINITE membership?</DialogTitle>
            <DialogContent dividers className="space-y-4 text-justify text-sm">
              <Container maxWidth={false} className="p-0">
                <Typography variant="body1" component="p">
                  By proceeding with the process for INFINITE membership extension, I hereby
                  acknowledge and agree to the following terms and conditions:
                </Typography>
                <Typography variant="body1" color="text.secondary" component="p" className="italic">
                  Dengan melanjutkan proses untuk perpanjangan keanggotaan INFINITE, saya dengan ini
                  mengakui dan menyetujui syarat dan ketentuan berikut:
                </Typography>
              </Container>

              <Container maxWidth={false} className="space-y-3 p-0">
                <Container maxWidth={false} className="p-0">
                  <Typography variant="body1" component="p" className="font-semibold">
                    1. Commitment to Active Participation
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    1. Komitmen Berpartisipasi Aktif
                  </Typography>
                  <Typography variant="body1" component="p">
                    I am willing to actively participate, contribute, and take responsibility in the
                    programs, collaborative projects, and activities organized by INFINITE
                    throughout the upcoming membership period.
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    Saya bersedia untuk berperan aktif, berkontribusi, dan bertanggung jawab dalam
                    program, proyek kolaboratif, serta kegiatan yang diselenggarakan oleh INFINITE
                    sepanjang periode keanggotaan ke depan.
                  </Typography>
                </Container>

                <Container maxWidth={false} className="p-0">
                  <Typography variant="body1" component="p" className="font-semibold">
                    2. Dedication to Achievement and Accountability
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    2. Dedikasi untuk Berprestasi dan Akuntabilitas
                  </Typography>
                  <Typography variant="body1" component="p">
                    I am committed to continuously developing my technical and professional skills,
                    striving for excellence, and actively working to contribute achievements to the
                    organization, particularly in the field of information technology. Furthermore,
                    I commit to promptly reporting and documenting all my competition results and
                    achievements within the INFINITE information system.
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    Saya berkomitmen untuk terus mengembangkan keterampilan teknis dan profesional
                    saya, berusaha mencapai keunggulan, serta bekerja aktif untuk menyumbangkan
                    prestasi bagi organisasi, khususnya di bidang teknologi informasi. Lebih lanjut,
                    saya berkomitmen untuk segera melaporkan dan mendokumentasikan semua hasil
                    kompetisi serta prestasi saya ke dalam sistem informasi INFINITE.
                  </Typography>
                </Container>

                <Container maxWidth={false} className="p-0">
                  <Typography variant="body1" component="p" className="font-semibold">
                    3. Contribution to the Community
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    3. Kontribusi pada Komunitas
                  </Typography>
                  <Typography variant="body1" component="p">
                    I agree to foster a collaborative environment, share knowledge with fellow
                    members, and uphold the core values and good name of INFINITE as a division
                    under UKM Rekayasa Teknologi (Restek) Universitas Negeri Yogyakarta.
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    Saya bersedia untuk membangun lingkungan yang kolaboratif, berbagi pengetahuan
                    dengan sesama anggota, dan menjunjung tinggi nilai-nilai inti serta nama baik
                    INFINITE sebagai divisi di bawah naungan UKM Rekayasa Teknologi (Restek)
                    Universitas Negeri Yogyakarta.
                  </Typography>
                </Container>

                <Container maxWidth={false} className="p-0">
                  <Typography variant="body1" component="p" className="font-semibold">
                    4. Adherence to Organizational Guidelines
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    4. Kepatuhan terhadap Pedoman Organisasi
                  </Typography>
                  <Typography variant="body1" component="p">
                    I agree to fully comply with all established rules, structures, and policies of
                    the organization, and I am ready to accept the consequences if I fail to meet
                    these organizational standards.
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    Saya bersedia untuk mematuhi sepenuhnya semua aturan, struktur, dan kebijakan
                    organisasi yang telah ditetapkan, dan saya siap menerima konsekuensi apabila
                    saya gagal memenuhi standar organisasi tersebut.
                  </Typography>
                </Container>

                <Container maxWidth={false} className="p-0">
                  <Typography variant="body1" component="p" className="font-semibold">
                    5. Data Management Consent
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    5. Persetujuan Pengelolaan Data
                  </Typography>
                  <Typography variant="body1" component="p">
                    I consent to the collection and processing of my profile, project, and
                    achievement data within the INFINITE organizational information system for
                    administrative, evaluation, and organizational development purposes.
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component="p"
                    className="italic"
                  >
                    Saya menyetujui pengumpulan dan pemrosesan data profil, proyek, dan prestasi
                    saya di dalam sistem informasi organisasi INFINITE untuk keperluan administrasi,
                    evaluasi, dan pengembangan organisasi.
                  </Typography>
                </Container>
              </Container>

              <Container maxWidth={false} className="p-0">
                <Typography variant="body1" component="p" className="mt-4 font-medium">
                  By clicking Continue, I agree to all the terms and conditions stated above.
                </Typography>
                <Typography variant="body1" color="text.secondary" component="p" className="italic">
                  Dengan mengklik Lanjutkan, saya menyetujui semua syarat dan ketentuan yang telah
                  disebutkan di atas.
                </Typography>
              </Container>
            </DialogContent>
            <DialogActions className="px-6 pb-5">
              <Button onClick={() => setTncOpen(false)}>Cancel</Button>
              <Button
                onClick={handleExtendAccept}
                variant="tonal"
                color="primary"
                disabled={isExtending}
              >
                {isExtending ? 'Processing...' : 'Continue'}
              </Button>
            </DialogActions>
          </Dialog>

          <Box
            component="section"
            className="mb-4 flex h-[calc(100vh-18rem)] min-h-60 w-full items-center justify-center px-6"
          >
            <Container maxWidth={false} className="max-w-2xl p-0 text-center">
              <Image
                src="/assets/images/feeling-happy.svg"
                alt="Let's extend!"
                width={300}
                height={300}
                loading="eager"
                className="mx-auto block"
              />
              <Typography variant="h6" component="p" align="center" className="mt-8">
                Ready to embark on another year of growth with INFINITE?
              </Typography>
              <Button
                variant="filled"
                color="primary"
                size="large"
                className="mx-auto mt-3"
                endIcon={<RocketLaunchRounded />}
                onClick={() => setTncOpen(true)}
              >
                Extend membership
              </Button>
            </Container>
          </Box>
        </>
      );
    }
  } else {
    return (
      <Box
        component="section"
        className="mb-4 flex h-[calc(100vh-18rem)] min-h-60 w-full items-center justify-center px-6"
      >
        <Container maxWidth={false} className="max-w-2xl p-0">
          <Image
            src="/assets/images/cancel.svg"
            alt="Closed"
            width={300}
            height={300}
            loading="eager"
            className="mx-auto block"
          />
          <Typography variant="h6" component="p" align="center" className="mt-8">
            Membership extension is currently unavailable.
          </Typography>
          {allowReregistration && startReregistrationDate && endReregistrationDate ? (
            <Typography variant="body1" align="center" className="mt-2">
              The membership extension period is from{' '}
              {DateTime.fromJSDate(startReregistrationDate).toFormat('dd/LL/yyyy, HH:mm:ss ZZZZ')}{' '}
              to {DateTime.fromJSDate(endReregistrationDate).toFormat('dd/LL/yyyy, HH:mm:ss ZZZZ')}.
            </Typography>
          ) : null}
        </Container>
      </Box>
    );
  }
}
