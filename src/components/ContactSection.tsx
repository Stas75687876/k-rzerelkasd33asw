'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name muss mindestens 2 Zeichen lang sein.' }),
  email: z.string().email({ message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' }),
  message: z.string().min(10, { message: 'Nachricht muss mindestens 10 Zeichen lang sein.' }),
});

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  // Form submission handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Here you would typically send this data to your backend or email service
    alert('Vielen Dank für Ihre Nachricht! Wir werden uns schnellstmöglich bei Ihnen melden.');
    form.reset();
  }

  return (
    <section 
      id="kontakt" 
      className="py-20 md:py-32 bg-gradient-to-b from-purple-950 to-black"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Kontaktieren Sie <span className="text-purple-400">uns</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">
            Haben Sie Fragen oder möchten Sie ein Projekt besprechen? Füllen Sie das Formular aus, 
            und wir melden uns umgehend bei Ihnen.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7 }}
            className="bg-white/5 backdrop-blur-sm p-8 rounded-xl"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ihr Name" 
                          {...field} 
                          className="bg-white/10 border-purple-500/30 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">E-Mail</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="ihre.email@example.com" 
                          type="email"
                          {...field} 
                          className="bg-white/10 border-purple-500/30 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nachricht</FormLabel>
                      <FormControl>
                        <textarea 
                          {...field} 
                          placeholder="Ihre Nachricht an uns..."
                          className="w-full min-h-[120px] rounded-md border border-purple-500/30 bg-white/10 p-4 text-white resize-y"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Nachricht senden
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </motion.div>
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Phone size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium mb-1">Telefon</h3>
                  <p className="text-gray-300">+49 123 456 789</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Mail size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium mb-1">E-Mail</h3>
                  <p className="text-gray-300">kundenservice@ct-studio.store</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <MapPin size={24} className="text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-medium mb-1">Adresse</h3>
                  <p className="text-gray-300">
                    Flurweg 13<br />
                    93527 Aholming<br />
                    Deutschland
                  </p>
                </div>
              </div>
              
              {/* Social Media Links */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <h3 className="text-white text-lg font-medium mb-4">Folgen Sie uns</h3>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                    <motion.a
                      key={social}
                      href={`#${social}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-purple-500/20 p-3 rounded-full text-white hover:bg-purple-500/40 transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <div className="w-5 h-5 flex items-center justify-center">
                        {/* Replace with actual social icons */}
                        {social[0].toUpperCase()}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 