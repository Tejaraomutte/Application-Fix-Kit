import './globals.css'; import {ThemeProvider} from '../components/ThemeProvider'; import {Nav} from '../components/Nav';
export const metadata={title:'Application Fix Kit | Improve Your Internship & Job Applications',description:'A practical application audit workbook for engineering students. Match job requirements with resume evidence, identify gaps and improve your application before applying.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body><ThemeProvider><Nav/>{children}</ThemeProvider></body></html>}
