import { useState } from 'react';
import { Layout, Card, Steps, Form, Button } from 'antd';
import InputForm from '@/components/InputForm';
import ProductStats from '@/components/ProductStats';
import styles from './index.less';

const { Header, Content } = Layout;
const { Step } = Steps;

export default function IndexPage() {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);

  return (
    <Layout>
      <Header className={styles.header}>
        <Steps className={styles.steps} current={step}>
          <Step title="INPUT" />
          <Step title="OUTPUT" />
        </Steps>
      </Header>
      <Content className={styles.content}>
        <Card className={styles.card}>
          {step === 0 ? (
            <InputForm form={form} onSubmit={() => setStep(1)} />
          ) : (
            <ProductStats form={form} />
          )}
          {step === 1 && (
            <div className={styles.buttonWrapper}>
              <Button onClick={() => setStep(0)} type="primary">
                Back To Input
              </Button>
            </div>
          )}
        </Card>
      </Content>
    </Layout>
  );
}
