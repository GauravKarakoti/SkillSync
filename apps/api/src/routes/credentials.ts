import { Router } from 'express';
import { MocaService } from '../moca-integration/moca.service';
import { Credential } from '../shared-types/src/credential';

const router = Router();
const mocaService = new MocaService();

router.post('/issue', async (req, res) => {
  const { recipientDid, credential } = req.body as { recipientDid: string, credential: Credential };

  if (!recipientDid || !credential) {
    return res.status(400).json({ error: 'Missing recipientDid or credential in request body' });
  }

  try {
    const txHash = await mocaService.issueCredential(recipientDid, credential);
    res.status(200).json({ message: 'Credential issued successfully', txHash });
  } catch (error) {
    res.status(500).json({ error: 'Failed to issue credential' });
  }
});

export default router;