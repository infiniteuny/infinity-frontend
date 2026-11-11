'use client';

import { APP } from '@config';
import Image from 'next/image';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';

export function FaqSection() {
  return (
    <Box
      id="faq"
      component="section"
      className="bg-(--m3-palette-surfaceContainerLowest-main) py-20"
    >
      <Container maxWidth="md">
        <Stack className="mb-12 items-center text-center">
          <Image
            src="/assets/images/faqs.svg"
            alt="FAQ INFINITE UNY"
            width={220}
            height={160}
            className="mb-6 h-auto max-w-full"
          />
          <Chip label="FAQ" color="primary" size="small" className="mb-3 font-semibold" />
          <Typography
            variant="h3"
            component="h2"
            className="mb-4 text-3xl font-extrabold sm:text-4xl"
          >
            Pertanyaan yang Sering Diajukan
          </Typography>
          <Typography
            variant="body1"
            className="text-base text-(--m3-palette-onSurfaceVariant-main)"
          >
            Temukan jawaban cepat seputar keanggotaan, kegiatan, dan organisasi INFINITE.
          </Typography>
        </Stack>

        <Stack spacing={1.5}>
          {APP.faqs.map((faq, idx) => (
            <Accordion
              key={faq.question}
              disableGutters
              elevation={0}
              defaultExpanded={idx === 0}
              className="overflow-hidden rounded-3xl bg-(--m3-palette-surfaceContainerHigh-main) shadow-none before:hidden"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreRounded />}
                className="px-6 py-2 font-semibold"
              >
                <Typography variant="subtitle1" className="font-bold">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails className="px-6 pt-0 pb-5">
                <Typography
                  variant="body2"
                  className="leading-relaxed text-(--m3-palette-onSurfaceVariant-main)"
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
