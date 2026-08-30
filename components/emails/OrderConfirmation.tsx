import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components'
import * as React from 'react'

interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  items: Array<{
    name: string
    quantity: number
    price: number
    image?: string
    sku: string
  }>
  subtotal: number
  shippingCost: number
  total: number
}

export const OrderConfirmationEmail = ({
  orderNumber,
  customerName,
  items,
  subtotal,
  shippingCost,
  total,
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Order Confirmation - AudiParts Direct #{orderNumber}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={logo}>
            Audi<span style={{ color: '#a6192e' }}>Parts</span> Direct
          </Heading>
        </Section>
        
        <Section style={content}>
          <Heading style={greeting}>Hi {customerName},</Heading>
          <Text style={paragraph}>
            Thank you for your order! We've received your request and our team is currently processing it. 
            We'll get back to you as soon as your parts are ready for dispatch.
          </Text>
          
          <Section style={orderInfo}>
            <Text style={orderLabel}>Order Number</Text>
            <Text style={orderValue}>#{orderNumber}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={headingSmall}>Order Summary</Text>
          
          {items.map((item, index) => (
            <Section key={index} style={itemRow}>
               <Row>
                <Column style={{ width: '60px' }}>
                   {item.image ? (
                     <Img
                       src={item.image}
                       width="50"
                       height="50"
                       alt={item.name}
                       style={itemImage}
                     />
                   ) : (
                     <div style={placeholderImage}>⚙️</div>
                   )}
                </Column>
                <Column>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>SKU: {item.sku} | Qty: {item.quantity}</Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </Column>
              </Row>
            </Section>
          ))}

          <Hr style={hr} />

          <Section style={totals}>
            <Row>
              <Column>
                <Text style={totalLabel}>Subtotal</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>${subtotal.toFixed(2)}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={totalLabel}>Shipping</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>${shippingCost.toFixed(2)}</Text>
              </Column>
            </Row>
            <Hr style={hrTiny} />
            <Row>
              <Column>
                <Text style={totalLabelBold}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={totalValueBold}>${total.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          <Hr style={hr} />

          <Text style={paragraph}>
            Our team will contact you shortly via email with tracking details once your order has been processed.
          </Text>
          
          <Text style={footerText}>
            If you have any questions, please reply to this email or visit our{' '}
            <Link href="https://audipartsdirect.com/contact" style={link}>
              contact page
            </Link>.
          </Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerCopy}>
            © {new Date().getFullYear()} AudiParts Direct. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '0',
  maxWidth: '600px',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
}

const header = {
  backgroundColor: '#101317',
  padding: '30px',
  textAlign: 'center' as const,
}

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-1px',
}

const content = {
  padding: '40px',
}

const greeting = {
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 15px',
}

const paragraph = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#4b5563',
  margin: '0 0 20px',
}

const orderInfo = {
  backgroundColor: '#f9fafb',
  padding: '15px 20px',
  borderRadius: '8px',
  margin: '20px 0',
}

const orderLabel = {
  fontSize: '12px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  color: '#9ca3af',
  margin: '0',
}

const orderValue = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#101317',
  margin: '5px 0 0',
}

const headingSmall = {
  fontSize: '14px',
  fontWeight: '700',
  textTransform: 'uppercase' as const,
  color: '#101317',
  margin: '30px 0 15px',
}

const itemRow = {
  margin: '0 0 15px',
}

const itemImage = {
  borderRadius: '8px',
  border: '1px solid #f3f4f6',
}

const placeholderImage = {
    width: '50px',
    height: '50px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px'
}

const itemName = {
  fontSize: '14px',
  fontWeight: '700',
  margin: '0',
  color: '#101317',
}

const itemMeta = {
  fontSize: '12px',
  color: '#6b7280',
  margin: '2px 0 0',
}

const itemPrice = {
  fontSize: '14px',
  fontWeight: '700',
  margin: '0',
}

const totals = {
  margin: '20px 0',
}

const totalLabel = {
  fontSize: '14px',
  color: '#6b7280',
  margin: '5px 0',
}

const totalValue = {
  fontSize: '14px',
  color: '#101317',
  margin: '5px 0',
}

const totalLabelBold = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#101317',
  margin: '10px 0',
}

const totalValueBold = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#a6192e',
  margin: '10px 0',
}

const hr = {
  borderColor: '#f3f4f6',
  margin: '20px 0',
}

const hrTiny = {
  borderColor: '#f3f4f6',
  margin: '10px 0',
}

const link = {
  color: '#a6192e',
  textDecoration: 'underline',
}

const footerText = {
  fontSize: '13px',
  color: '#9ca3af',
  lineHeight: '20px',
  marginTop: '40px',
}

const footer = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  textAlign: 'center' as const,
}

const footerCopy = {
  fontSize: '12px',
  color: '#9ca3af',
  margin: '0',
}
