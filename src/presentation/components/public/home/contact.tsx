'use client';

import { Button, Card, Input, Textarea } from '@material-tailwind/react';

export function Contact() {
  return (
    <section id="contact" className="px-6 text-gray-700 bg-white md:px-12 lg:px-18">
      <div className="py-20 max-w-6xl mx-auto">
        <h2 className="mb-10 text-3xl text-center font-semibold">Contact Us</h2>
        <div className="flex flex-col gap-10 items-center justify-center lg:flex-row">
          <div className="flex-1">
            <Card color="transparent" shadow={false} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Input size="lg" label="Name" />
                <Input size="lg" label="Email" />
              </div>
              <Input size="lg" label="Title" />
              <Textarea resize={true} label="Message" />
              <Button
                size="md"
                className="ml-auto !normal-case !bg-infinite-green !shadow-infinite-green/20 hover:!shadow-infinite-green/40"
              >
                Send
              </Button>
            </Card>
          </div>
          <div className="flex-1">
            <div className="aspect-[4/3]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d988.2926823734255!2d110.38661476064377!3d-7.771713330718903!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59b6f88350e5%3A0xf58fe9fa3eea58ab!2sINFINITE%20UNY%20(Divisi%20Teknologi%20Informasi%20UKM%20Rekayasa%20Teknologi%20UNY)!5e0!3m2!1sen!2sid!4v1678600166185!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '10px' }}
                loading="lazy"
                allowFullScreen={true}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
